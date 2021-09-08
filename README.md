# PowerPool xCVP
## Example query

```js
{
  info(id: "LATEST") {
    lastPriceTick
    lastVolumeTick
    totalPriceTicks
    totalVolumeTicks
  }
  priceTicks(first: 5, orderBy: timestamp, orderDirection: desc) {
    id
    cvpPrice
    xcvpPrice
    timestamp
  }
  volumeTicks(first: 5, orderBy: timestamp, orderDirection: desc) {
    id
    totalVolume
    timestamp
  }
}
```
## Deploying mainnet subgraph

Login into Graph (ask the admin for `access token`)

```sh
graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>
```

Deploy the compiled `subgraph.yaml`:

```sh
yarn run deploy-mainnet
```
