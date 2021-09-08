import {Address, BigDecimal, BigInt, log} from "@graphprotocol/graph-ts";
import {ERC20} from "../generated/VolumeTick/ERC20";

let T_AAVE = Address.fromString('0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'); // AAVE
let T_YFI = Address.fromString('0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e'); // YFI
let T_SNX = Address.fromString('0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'); // SNX
let T_CVP = Address.fromString('0x38e4adb44ef08f22f5b5b76a8f0c2d0dcbe7dca1'); // CVP
let T_COMP = Address.fromString('0xc00e94cb662c3520282e6f5717214004a7f26888'); // COMP
let T_WXNM = Address.fromString('0x0d438f3b5175bebc262bf23753c1e53d03432bde'); // wNXM
let T_MKR = Address.fromString('0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'); // MKR
let T_UNI = Address.fromString('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'); // UNI
let T_SUSHI = Address.fromString('0x6b3595068778dd592e39a122f4f5a5cf09c90fe2'); // SUSHI
let T_CREAM = Address.fromString('0x2ba592f78db6436527729929aaf6c908497cb200'); // CREAM
let T_AKRO = Address.fromString('0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7'); // AKRO
let T_PICKLE = Address.fromString('0x429881672b9ae42b8eba0e26cd9c73711b891ca5'); // PICKLE
let T_KP3R = Address.fromString('0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44'); // KP3R
let T_YVCRV_USDN = Address.fromString('0x3b96d491f067912d18563d56858ba7d6ec67a6fa'); // yvCurve-USDN
let T_YVCRV_LUSD = Address.fromString('0x5fa5b62c8af877cb37031e0a3b2f34a78e3c56a6'); // yvCurve-LUSD
let T_YVCRV_BUSD = Address.fromString('0x6ede7f19df5df6ef23bd5b9cedb651580bdf56ca'); // yvCurve-BUSD
let T_YVCRV_USDP = Address.fromString('0xc4daf3b5e2a9e93861c3fbdd25f1e943b8d87417'); // yvCurve-USDP
let T_YVCRV_DAI_DEPR = Address.fromString('0x629c759D1E83eFbF63d84eb3868B564d9521C129'); // yvCurve-DAI  DEPRECATED
let T_YVCRV_USDC_DEPR = Address.fromString('0x9cA85572E6A3EbF24dEDd195623F188735A5179f'); // yvCurve-USDC DEPRECATED
let T_YVCRV_GUSD_DEPR = Address.fromString('0xcC7E70A958917cCe67B4B87a8C30E6297451aE98'); // yvCurve-GUSD DEPRECATED
let T_YVCRV_TUSD_DEPR = Address.fromString('0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c'); // yvCurve-TUSD DEPRECATED
let T_YVCRV_USDT_DEPR = Address.fromString('0x2994529C0652D127b7842094103715ec5299bBed'); // yvCurve-USDT DEPRECATED
let T_PIPT = Address.fromString('0x26607ac599266b21d13c7acf7942c7701a8b699c'); // PIPT
let T_YETI = Address.fromString('0xb4bebd34f6daafd808f73de0d10235a92fbb6c3d'); // YETI
let T_ASSY = Address.fromString('0xfa2562da1bba7b954f26c74725df51fb62646313'); // ASSY
let T_YLA = Address.fromString('0x9ba60ba98413a60db4c651d4afe5c937bbd8044b'); // YLA

let E_AAVE = ERC20.bind(T_AAVE); // AAVE
let E_YFI = ERC20.bind(T_YFI); // YFI
let E_SNX = ERC20.bind(T_SNX); // SNX
let E_CVP = ERC20.bind(T_CVP); // CVP
let E_COMP = ERC20.bind(T_COMP); // COMP
let E_WXNM = ERC20.bind(T_WXNM); // wNXM
let E_MKR = ERC20.bind(T_MKR); // MKR
let E_UNI = ERC20.bind(T_UNI); // UNI
let E_SUSHI = ERC20.bind(T_SUSHI); // SUSHI
let E_CREAM = ERC20.bind(T_CREAM); // CREAM
let E_AKRO = ERC20.bind(T_AKRO); // AKRO
let E_PICKLE = ERC20.bind(T_PICKLE); // PICKLE
let E_KP3R = ERC20.bind(T_KP3R); // KP3R
let E_YVCRV_USDN = ERC20.bind(T_YVCRV_USDN); // yvCurve-USDN
let E_YVCRV_LUSD = ERC20.bind(T_YVCRV_LUSD); // yvCurve-LUSD
let E_YVCRV_BUSD = ERC20.bind(T_YVCRV_BUSD); // yvCurve-BUSD
let E_YVCRV_USDP = ERC20.bind(T_YVCRV_USDP); // yvCurve-USDP
let E_YVCRV_DAI_DEPR = ERC20.bind(T_YVCRV_DAI_DEPR); // yvCurve-DAI  DEPRECATED
let E_YVCRV_USDC_DEPR = ERC20.bind(T_YVCRV_USDC_DEPR); // yvCurve-USDC DEPRECATED
let E_YVCRV_GUSD_DEPR = ERC20.bind(T_YVCRV_GUSD_DEPR); // yvCurve-GUSD DEPRECATED
let E_YVCRV_TUSD_DEPR = ERC20.bind(T_YVCRV_TUSD_DEPR); // yvCurve-TUSD DEPRECATED
let E_YVCRV_USDT_DEPR = ERC20.bind(T_YVCRV_USDT_DEPR); // yvCurve-USDT DEPRECATED
let E_PIPT = ERC20.bind(T_PIPT); // PIPT
let E_YETI = ERC20.bind(T_YETI); // YETI
let E_ASSY = ERC20.bind(T_ASSY); // ASSY
let E_YLA = ERC20.bind(T_YLA); // YLA

export let PI_SUSHI = Address.fromString('0xf3505383b740af8c241f1cf6659619a9c38d0281');

let decimals = new Map<Address, i32>();
let decimalDividers = new Map<Address, BigDecimal>();

export function getDecimals(token: Address): i32 {
  if (decimals.has(token)) {
    return decimals.get(token);
  } else {
    let res = ERC20.bind(token).try_decimals();
    if (res.reverted) {
      log.error("Missing balance info", []);
      throw new Error("Missing balance info");
    } else {
      decimals.set(token, res.value);
    }
    return res.value;
  }
}

export function getBigDecimalDivider(token: Address): BigDecimal {
  if (decimalDividers.has(token)) {
    return decimalDividers.get(token);
  } else {
    let divider: BigDecimal = new BigDecimal(BigInt.fromI32(10).pow(getDecimals(token) as u8));
    decimalDividers.set(token, divider);
    return divider;
  }
}

export let ORACLIZED_TOKENS: Array<ERC20> = [
  E_AAVE,
  E_YFI,
  E_SNX,
  E_CVP,
  E_COMP,
  E_WXNM,
  E_MKR,
  E_UNI,
  E_SUSHI,
  E_CREAM,
  E_AKRO,
  E_PICKLE,
  E_KP3R,
];

export let YCRV_V1_TOKENS: Array<ERC20> = [
  E_YVCRV_DAI_DEPR,
  E_YVCRV_USDC_DEPR,
  E_YVCRV_GUSD_DEPR,
  E_YVCRV_USDT_DEPR,
  E_YVCRV_TUSD_DEPR,
];

export let YCRV_V2_TOKENS: Array<ERC20> = [
  E_YVCRV_USDN,
  E_YVCRV_LUSD,
  E_YVCRV_BUSD,
  E_YVCRV_USDP,
];

export let PP_POOL_TOKENS: Array<ERC20> = [
  E_PIPT,
  E_YETI,
  E_ASSY,
  E_YLA,
];

export function hasOraclizedPrice(address: Address): boolean {
  return address.equals(T_AAVE) ||
    address.equals(T_YFI) ||
    address.equals(T_SNX) ||
    address.equals(T_CVP) ||
    address.equals(T_COMP) ||
    address.equals(T_WXNM) ||
    address.equals(T_MKR) ||
    address.equals(T_UNI) ||
    address.equals(T_SUSHI) ||
    address.equals(T_CREAM) ||
    address.equals(T_AKRO) ||
    address.equals(T_PICKLE) ||
    address.equals(T_KP3R);
}

export function hasYV1Price(address: Address): boolean {
  return address.equals(T_YVCRV_DAI_DEPR) ||
    address.equals(T_YVCRV_USDC_DEPR) ||
    address.equals(T_YVCRV_GUSD_DEPR) ||
    address.equals(T_YVCRV_USDT_DEPR) ||
    address.equals(T_YVCRV_TUSD_DEPR);
}

export function hasYV2Price(address: Address): boolean {
  return address.equals(T_YVCRV_USDN) ||
    address.equals(T_YVCRV_LUSD) ||
    address.equals(T_YVCRV_BUSD) ||
    address.equals(T_YVCRV_USDP);
}
