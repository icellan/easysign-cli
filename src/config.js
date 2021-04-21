import config from '../config.json';

export const EASYSIGN_BITCOM_ADDRESS = '1ESYrLMMC3izqPye3GdtVAySfnNrNypXVL';
export const PLANARIA_TOKEN = process.env.PLANARIA_TOKEN || global.PLANARIA_TOKEN || config.token;
