import { ActionType } from "@smartface/native/device/multimedia/multimedia";
import { Actions } from "@smartface/styling-context";

export const updateUserStyle = (userStyle: any): Actions => ({
    type: 'updateUserStyle',
    userStyle
});

export const pushClassNames = (classNames: string[]): Actions => ({
    type: 'pushClassNames',
    classNames
});

export const removeClassName = (className: string): Actions => ({
    type: 'removeClassName',
    className
});