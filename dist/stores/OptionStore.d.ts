export declare const useOptionStore: import('pinia').StoreDefinition<"OptionStore", {
    storName: string;
    tabMenu: string;
}, {}, {
    funcTest(): void;
}>;
export type OptionType = ReturnType<typeof useOptionStore>;
