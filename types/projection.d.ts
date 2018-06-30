import { IGyreEvent, IReducer } from './interfaces';
export declare class Projection {
    protected state: object;
    protected readonly reducer: IReducer;
    constructor(state: object, reducer: IReducer);
    /**
     * Apply events on this projection. If the state has been altered, return true.
     * @param {IGyreEvent} evt
     * @param {object} parentState
     * @returns {boolean}
     */
    applyEvent(evt: IGyreEvent, parentState?: object): boolean;
    getState(): object;
}
