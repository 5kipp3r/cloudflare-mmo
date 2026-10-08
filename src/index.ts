export interface Env { ASSETS: Fetcher }
export default { async fetch(request:Request, env:Env){ return env.ASSETS.fetch(request) } };
