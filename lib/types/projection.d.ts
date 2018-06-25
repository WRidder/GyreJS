import { IGyreEvent, IReducer } from './interfaces';
export declare class Projection {
    private state;
    private readonly reducer;
    constructor(state: object, reducer: IReducer);
    /**
     * Apply events on this projection. If the state has been altered, return true.
     * @param {IGyreEvent} evt
     * @returns {boolean}
     */
    applyEvent(evt: IGyreEvent): boolean;
    getState(): object;
}
