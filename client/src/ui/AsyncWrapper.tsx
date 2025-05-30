import { ReactNode } from "react";
import { Loading } from "./Loading"
import ReportIcon from '@mui/icons-material/Report';
import { EHttpStatus } from "../util/api/http";

/**
 * describes visually the current state of an http request
 * @param status the http request current status 
 */
export const AsyncWrapper: React.FC<{children: ReactNode, status: EHttpStatus}> = (props) => {

    return<>
    {props.status === EHttpStatus.Loading && <Loading/>}
    {props.status === EHttpStatus.Rejected && <ReportIcon color='inherit'/>}
    {props.status === EHttpStatus.Fulfilled && <>{props.children}</>}
    </>
  }