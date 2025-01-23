import { SubScribeOptions } from "./types";

export const DefaultSubscribeOptions: SubScribeOptions = {
    start: 60 * 1000,
    end: 0,
    autoUnsubscribe: true,
    step: 1000,
    name: '',
    isDecrease: true,
    notifyOnSubscribe: true
}