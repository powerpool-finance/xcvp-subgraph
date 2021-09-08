import {Info, VolumeTick} from "../../generated/schema";
import {Address, BigDecimal, BigInt, log, ethereum} from "@graphprotocol/graph-ts/index";
import {
  getBigDecimalDivider,
  getDecimals,
  ORACLIZED_TOKENS, PI_SUSHI,
  PP_POOL_TOKENS,
  YCRV_V1_TOKENS,
  YCRV_V2_TOKENS
} from "../tokens";
import {BI_0, infoId, ONE_DAY} from "../constants";
import {AnchorPriceUpdated} from "../../generated/VolumeTick/PowerOracle";
import {ERC20} from "../../generated/VolumeTick/ERC20";
import {
  estimateOraclizedPrice,
  estimatePowerPoolPrice,
  estimateYearnVaultV1Price,
  estimateYearnVaultV2Price
} from "../priceEstimators";

let CVP_MAKER = Address.fromString('0x8c22e596e66b98ec1d2ea45b40d879c705e5e047');
let PVP_V1 = Address.fromString('0xD132973EaEbBd6d7ca7b88e9170f2CCA058de430');

type TokenPriceHandler = (token: Address) => BigDecimal;

export function handleOraclePriceUpdate(event: AnchorPriceUpdated): void {
  let info = Info.load(infoId);
  if (info == null) {
    info = new Info(infoId);
    info.lastPriceTick = BigInt.fromI32(0);
    info.lastVolumeTick = BigInt.fromI32(0);
    info.totalPriceTicks = 0;
    info.totalVolumeTicks = 0;
  }

  if (info.lastVolumeTick.plus(ONE_DAY).gt(event.block.timestamp)) {
    return;
  }

  let id = event.block.timestamp.toString();
  let volumeTick = VolumeTick.load(id);
  if (volumeTick == null) {
    volumeTick = new VolumeTick(id);
    volumeTick.tokensCount = 0;
  }

  volumeTick.timestamp = event.block.timestamp;
  volumeTick.blockNumber = event.block.number;
  volumeTick.totalVolume = BigDecimal.fromString("0");

  handle('Oraclized', ORACLIZED_TOKENS, estimateOraclizedPrice, volumeTick, info);
  handle('Yearn Vault V1', YCRV_V1_TOKENS, estimateYearnVaultV1Price, volumeTick, info);
  handle('Yearn Vault V2', YCRV_V2_TOKENS, estimateYearnVaultV2Price, volumeTick, info);
  handle('PowerPool Pool', PP_POOL_TOKENS, estimatePowerPoolPrice, volumeTick, info);

  info.lastVolumeTick = event.block.timestamp;
  info.totalVolumeTicks += 1;

  volumeTick.save();
  info.save();
}

function handle(title: string, tokens: Array<ERC20>, getPrice: TokenPriceHandler, vt: VolumeTick | null, info: Info | null): void {
  for (let i = 0; i < tokens.length; i++) {
    let token: ERC20 = tokens[i];
    let tokenBalance = getBalanceOfToken(token);

    if (tokenBalance.gt(BI_0)) {
      let tokenPrice: BigDecimal = getPrice(token._address);
      let tokenVolume: BigDecimal = tokenBalance.toBigDecimal().div(getBigDecimalDivider(token._address)).times(tokenPrice);
      vt.totalVolume += tokenVolume;
      vt.tokensCount += 1;
      let decimals: i32 = getDecimals(token._address);
      log.warning("Token Volume Tick #{}/{}; type: {}, token: {}, decimals: {}; balance: {}; price: {}, tokenVolume: {}; totalVolume: {}", [
        BigInt.fromI32(info.totalVolumeTicks).toString(),
        BigInt.fromI32(vt.tokensCount).toString(),
        title,
        token._address.toHexString(),
        decimals.toString(),
        tokenBalance.toBigDecimal().toString(),
        tokenPrice.toString(),
        tokenVolume.toString(),
        vt.totalVolume.toString()
      ]);
    }
  }
}

function getBalanceOfToken(token: ERC20): BigInt {
  // CVP_MAKER balance
  let res = token.try_balanceOf(CVP_MAKER);
  if (res.reverted) {
    throw Error("Missing balance info");
  }
  let cvpMakerBalance: BigInt = res.value;

  // PVP_V1 balance
  res = token.try_balanceOf(PVP_V1);
  if (res.reverted) {
    throw Error("Missing balance info");
  }

  return res.value + cvpMakerBalance;
}
