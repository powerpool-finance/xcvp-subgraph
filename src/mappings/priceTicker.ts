import {
  Info,
  PriceTick,
} from "../../generated/schema";
import {
  Address, BigDecimal, BigInt,
  log
} from "@graphprotocol/graph-ts";
import {PowerOracle} from "../../generated/PriceTick/PowerOracle";
import {Transfer, xCVP} from "../../generated/PriceTick/xCVP";

let infoId = "LATEST";
let ONE_HOUR = BigInt.fromI32(3600);

let POWER_ORACLE_ADDRESS = Address.fromString('0x50f8D7f4db16AA926497993F020364f739EDb988');
let CVP_ADDRESS = Address.fromString('0x38e4adb44ef08f22f5b5b76a8f0c2d0dcbe7dca1');
let XCVP_ADDRESS = Address.fromString('0x9ae236653325b29d5ab4a2c8cb285e8059c2c204');

let powerOracle = PowerOracle.bind(POWER_ORACLE_ADDRESS);
let cvp = xCVP.bind(CVP_ADDRESS);
let xCvp = xCVP.bind(XCVP_ADDRESS);

export function handleTransfer(event: Transfer): void {
  let timestamp: BigInt = event.block.number;

  let info = Info.load(infoId);
  if (info == null) {
    info = new Info(infoId);
    info.lastPriceTick = BigInt.fromI32(0);
    info.lastVolumeTick = BigInt.fromI32(0);
    info.totalVolumeTicks = 0;
    info.totalPriceTicks = 0;
  }

  if (info.lastPriceTick.plus(ONE_HOUR).gt(timestamp)) {
    return;
  }

  let id = timestamp.toString();
  let priceTick = PriceTick.load(id);
  if (priceTick == null) {
    priceTick = new PriceTick(id);
  }

  priceTick.timestamp = timestamp;

  let res = cvp.try_balanceOf(XCVP_ADDRESS);
  if (res.reverted) {
     log.warning("Missing CVP balance info", []);
     return;
  } else {
    priceTick.cvpBalance = res.value;
  }

  res = xCvp.try_totalSupply();
  if (res.reverted) {
    log.warning("Missing xCVP totalSupply info", []);
    return;
  } else {
    priceTick.totalSupply = res.value;
  }

  res = powerOracle.try_getPriceByAsset(CVP_ADDRESS);
  if (res.reverted) {
    log.warning("Missing CVP oracle price info", []);
    return;
  } else {
    let ONE_E6 = BigDecimal.fromString("1000000");
    priceTick.cvpPrice = res.value.toBigDecimal().div(ONE_E6);
  }

  priceTick.xcvpPrice = priceTick.cvpPrice
    .times(priceTick.cvpBalance.toBigDecimal())
    .div(priceTick.totalSupply.toBigDecimal())
    .truncate(6);

  priceTick.blockNumber = event.block.number;

  priceTick.save();

  info.lastPriceTick = timestamp;
  info.totalPriceTicks = info.totalPriceTicks + 1;
  info.save()
}
