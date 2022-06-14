import { Dispatch, SetStateAction } from "react";

export interface UserType {
    id: number,
    title: string,
    description: string,
    button?: string,
    link?: string,
    targets?: number,
    minutes?: number,
    highAvail?: boolean,
    recommended: string,
    select?: Dispatch<SetStateAction<any>>,
    selected?: UserType
}