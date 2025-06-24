export declare const useMainStore: import('pinia').StoreDefinition<"MainStore", Pick<{
    storName: import('vue').Ref<string, string>;
    tabMenu: import('vue').Ref<string, string>;
    uppercaseTab: import('vue').ComputedRef<string>;
    selectedTab: import('vue').Ref<number, number>;
    funcTest: () => string;
}, "storName" | "tabMenu" | "selectedTab">, Pick<{
    storName: import('vue').Ref<string, string>;
    tabMenu: import('vue').Ref<string, string>;
    uppercaseTab: import('vue').ComputedRef<string>;
    selectedTab: import('vue').Ref<number, number>;
    funcTest: () => string;
}, "uppercaseTab">, Pick<{
    storName: import('vue').Ref<string, string>;
    tabMenu: import('vue').Ref<string, string>;
    uppercaseTab: import('vue').ComputedRef<string>;
    selectedTab: import('vue').Ref<number, number>;
    funcTest: () => string;
}, "funcTest">>;
export type MainType = ReturnType<typeof useMainStore>;
