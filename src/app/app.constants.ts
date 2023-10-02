import { environment } from "src/environments/environment";

export class AppConstants {
    private static API_BASE_URL = environment.apiBaseUrl;

    //ARTCILE MODULE
    public static SPECIALTY_API_URL = `${ AppConstants.API_BASE_URL }specialty`;
    public static FAMILY_API_URL = `${ AppConstants.API_BASE_URL }family`;
    public static SUBFAMILY_API_URL = `${ AppConstants.API_BASE_URL }subfamily`;

    //UTIL
    public static COUNTRY_API_URL = `${ AppConstants.API_BASE_URL }country`;
    public static COUNTRY_STATE_API_URL = `${ AppConstants.API_BASE_URL }countrystate`;
    public static IMAGE_API_URL = `${ AppConstants.API_BASE_URL }images`

    //IMPORTER MODULE
    public static IMPORTER_API_URL = `${ AppConstants.API_BASE_URL }importer`;

    //CARRIER MODULE
    public static CARRIER_API_URL = `${ AppConstants.API_BASE_URL }carrier`;

    //PRIVIDER MODULE
    public static PROVIDER_API_URL = `${ AppConstants.API_BASE_URL }provider`;
}