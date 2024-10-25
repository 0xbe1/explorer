import {useParams} from "react-router-dom";
import {Grid} from "@mui/material";
import React from "react";
import FATabs, {TabValue} from "./Tabs";
import PageHeader from "../layout/PageHeader";
import {useGetIsGraphqlClientSupported} from "../../api/hooks/useGraphqlClient";
import LoadingModal from "../../components/LoadingModal";
import Error from "./Error";
import {ResponseError, ResponseErrorType} from "../../api/client";
import {isValidAccountAddress} from "../utils";
import FATitle from "./Title";
import {useGetFaMetadata} from "../../api/hooks/useGetFaMetadata";
import {useGetFASupply} from "../../api/hooks/useGetFaSupply";
import {useGetCoinList} from "../../api/hooks/useGetCoinList";
import {findCoinData} from "../Transaction/Tabs/BalanceChangeTab";

const TAB_VALUES_FULL: TabValue[] = ["info"];

const TAB_VALUES: TabValue[] = ["info", "transactions"];

export default function FAPage() {
  const isGraphqlClientSupported = useGetIsGraphqlClientSupported();
  const maybeAddress = useParams().address;
  let address: string = "";
  let error: ResponseError | null = null;
  if (maybeAddress && isValidAccountAddress(maybeAddress)) {
    address = maybeAddress;
  } else {
    error = {
      type: ResponseErrorType.INVALID_INPUT,
      message: `Invalid coin '${maybeAddress}'`,
    };
  }

  // TODO: add loading state
  // TODO: add errors?

  const {data: allCoinData} = useGetCoinList();
  const metadata = useGetFaMetadata(address);
  const supply = useGetFASupply(address);
  const isLoading = false;

  const coinData = findCoinData(allCoinData?.data, address);
  // TODO: Type and hand to tabs
  const data = {
    coinData: coinData,
    metadata: metadata,
    supply: supply,
  };

  const tabValues = isGraphqlClientSupported ? TAB_VALUES_FULL : TAB_VALUES;

  return (
    <Grid container spacing={1}>
      <LoadingModal open={isLoading} />
      <Grid item xs={12} md={12} lg={12}>
        <PageHeader />
      </Grid>
      <Grid item xs={12} md={8} lg={9} alignSelf="center">
        <FATitle address={address} metadata={metadata} coinData={coinData} />
      </Grid>
      <Grid item xs={12} md={12} lg={12} marginTop={4}>
        {error ? (
          <>
            <FATabs address={address} data={data} tabValues={tabValues} />
            <Error address={address} error={error} />
          </>
        ) : (
          <FATabs address={address} data={data} tabValues={tabValues} />
        )}
      </Grid>
    </Grid>
  );
}