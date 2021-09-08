import {Address, BigDecimal, BigInt, ethereum, log} from "@graphprotocol/graph-ts/index";
import {BD_0, BI_0, ONE_ETHER} from "./constants";
import {YearnVaultV1} from "../generated/VolumeTick/YearnVaultV1";
import {YearnVaultV2} from "../generated/VolumeTick/YearnVaultV2";
import {PowerOracle} from "../generated/VolumeTick/PowerOracle";
import {CurvePoolRegistry} from "../generated/VolumeTick/CurvePoolRegistry";
import {BPool} from "../generated/VolumeTick/BPool";
import {ERC20} from "../generated/VolumeTick/ERC20";
import {
  getBigDecimalDivider, hasOraclizedPrice, hasYV1Price, hasYV2Price,
  PI_SUSHI,
} from "./tokens";

let curveRegistry = CurvePoolRegistry.bind(Address.fromString('0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5'));

let POWER_ORACLE_ADDRESS = Address.fromString('0x50f8D7f4db16AA926497993F020364f739EDb988');
let powerOracle = PowerOracle.bind(POWER_ORACLE_ADDRESS);

export function estimateOraclizedPrice(token: Address): BigDecimal {
  let res = powerOracle.try_getPriceByAsset(token);
  if (res.reverted) {
    // log.warning("Missing oracle info for token {}", [token.toHexString()])
    // return BigDecimal.fromString("0");
    throw new Error('Missing oracle info for token');
  } else {
    return res.value.toBigDecimal().div(BigDecimal.fromString("1000000"))
  }
}

export function estimatePowerPoolPrice(token: Address): BigDecimal {
  let res = BPool.bind(token).try_getCurrentTokens();
  if (res.reverted) {
    throw new Error("Can't fetch PPool's token list");
  }

  let underlyingTokens: Array<Address> = res.value;

  let res2 = ERC20.bind(token).try_totalSupply();
  if (res2.reverted) {
    throw new Error("Can't fetch PPool's token list");
  }
  let totalSupply: BigInt = res2.value;

  let totalVolume: BigDecimal = BigDecimal.fromString("0");

  for (let i = 0; i < underlyingTokens.length; i++) {
    let balance: BigInt;
    let underlying: Address;
    let decimals: BigDecimal;

    if (underlyingTokens[i].equals(PI_SUSHI)) {
      let res = ERC20.bind(underlyingTokens[i]).try_totalSupply();
      if (res.reverted) {
        throw new Error("Error getting balanceOf piSushi token");
      }
      balance = res.value;
      underlying = Address.fromString("0x6b3595068778dd592e39a122f4f5a5cf09c90fe2");
      decimals = ONE_ETHER;
    } else {
      let res = ERC20.bind(underlyingTokens[i]).try_balanceOf(token);
      if (res.reverted) {
        throw new Error("Error getting balanceOf PPool's token");
      }
      balance = res.value;
      underlying = underlyingTokens[i];
      decimals = getBigDecimalDivider(underlying);
    }

    if (balance.equals(BI_0)) {
      continue;
    }
    let price: BigDecimal;

    if (hasOraclizedPrice(underlying)) {
      price = estimateOraclizedPrice(underlying)
    } else if (hasYV1Price(underlying)) {
      price = estimateYearnVaultV2Price(underlying)
    } else if (hasYV2Price(underlying)) {
      price = estimateYearnVaultV2Price(underlying);
    } else {
      // log.error("Unsupported underlying token {}", [
      //   underlying.toHexString(),
      // ])
      // price = BD_0;
      throw new Error("Unsupported underlying token")
    }

    let volume = balance.toBigDecimal()
      .div(decimals)
      .times(price);

    log.warning("Building Pool {}, underlying: {}, price: {}, balance: {}, volume: {}", [
      token.toHexString(),
      underlying.toHexString(),
      price.toString(),
      balance.toString(),
      volume.toString()
    ]);

    totalVolume += volume;
  }

  if (totalVolume.equals(BD_0) || totalSupply.equals(BI_0)) {
    return BD_0;
  }

  return totalVolume.div(totalSupply.toBigDecimal().div(ONE_ETHER));
}

export function estimateYearnVaultV1Price(vaultAddress: Address): BigDecimal {
  let yearnVault = YearnVaultV1.bind(vaultAddress);
  let res = yearnVault.try_getPricePerFullShare();

  if (res.reverted) {
    log.warning("Error getting pricePerFullShare for vault {}", [vaultAddress.toHexString()])
    return BD_0;
  }
  let pricePerShare = res.value.toBigDecimal().div(ONE_ETHER);

  let res2: ethereum.CallResult<Address> = yearnVault.try_token();
  if (res2.reverted) {
    log.warning("Error getting token info  for vault:{}", [vaultAddress.toHexString()])
    return BD_0;
  }
  let crvToken = res2.value.toHexString();

  let res3 = curveRegistry.try_get_virtual_price_from_lp_token(Address.fromString(crvToken));
  if (res3.reverted) {
    log.warning("Failed getting virtual for token:{}", [crvToken])
    return BD_0;
  }
  let virtualPrice = res3.value.toBigDecimal();

  log.debug(
    "getVaultPrice()::info: {}, pricePerShare {}, virtualPrice: {}",
    [vaultAddress.toHexString(), pricePerShare.toString(), virtualPrice.toString()]
  )

  return pricePerShare.times(virtualPrice).div(ONE_ETHER);
}

export function estimateYearnVaultV2Price(vaultAddress: Address): BigDecimal {
  let yearnVault = YearnVaultV2.bind(vaultAddress);
  let res = yearnVault.try_pricePerShare();

  if (res.reverted) {
    log.warning("Error getting pricePerShare for vault {}", [vaultAddress.toHexString()])
    return BD_0;
  }
  let pricePerShare = res.value.toBigDecimal().div(ONE_ETHER);

  let res2: ethereum.CallResult<Address> = yearnVault.try_token();
  if (res2.reverted) {
    log.warning("Error getting token info  for vault:{}", [vaultAddress.toHexString()])
    return BD_0;
  }
  let crvToken = res2.value.toHexString();

  let res3 = curveRegistry.try_get_virtual_price_from_lp_token(Address.fromString(crvToken));
  if (res3.reverted) {
    log.warning("Failed getting virtual for token:{}", [crvToken])
    return BD_0;
  }
  let virtualPrice = res3.value.toBigDecimal();

  log.debug(
    "getVaultPrice()::info: {}, pricePerShare {}, virtualPrice: {}",
    [vaultAddress.toHexString(), pricePerShare.toString(), virtualPrice.toString()]
  )

  return pricePerShare.times(virtualPrice).div(ONE_ETHER);
}
