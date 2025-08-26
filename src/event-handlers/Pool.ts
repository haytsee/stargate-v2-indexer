import { StargatePoolNative, StargatePoolUSDC, StargatePoolUSDT } from "generated";
import { eIdToNetworkId } from "./constants";
import type {
  BridgeTransfer,
  handlerContext as HandlerContext,
  StargatePoolNative_OFTSent_event as OFTSentEvent,
} from "generated/src/Types.gen";

type OFTSentArgs = { event: OFTSentEvent; context: HandlerContext };

const handleOFTSent = async (asset: string, args: OFTSentArgs) => {
  const { event, context } = args;

  let entity: BridgeTransfer = {
    id: `${event.chainId}-${event.block.number}-${event.logIndex}`,
    txHash: event.transaction.hash,
    timestamp: event.block.timestamp,
    sourceNetworkId: event.chainId,
    destinationAsset: asset,
    sourceAsset: asset,
    amountSent: event.params.amountSentLD,
    amountReceived: event.params.amountReceivedLD,
    destinationNetworkId: eIdToNetworkId[Number(event.params.dstEid)] ?? 0,
  };

  context.BridgeTransfer.set(entity);
};

StargatePoolNative.OFTSent.handler((args: OFTSentArgs) => handleOFTSent("ETH", args));
StargatePoolUSDC.OFTSent.handler((args: OFTSentArgs) => handleOFTSent("USDC", args));
StargatePoolUSDT.OFTSent.handler((args: OFTSentArgs) => handleOFTSent("USDT", args));
