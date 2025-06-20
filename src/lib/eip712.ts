export interface TypedDataDomain {
  name?: string;
  version?: string;
  chainId?: unknown;
  verifyingContract?: string;
  salt?: ArrayLike<number> | string;
}
export interface TypedDataTypes {
  name: string;
  type: string;
}
export type TypedMessageTypes = {
  [key: string]: TypedDataTypes[];
};
export type EIP712TypedData = {
  domain: TypedDataDomain;
  types: TypedMessageTypes;
  message: Record<string, unknown>;
};
