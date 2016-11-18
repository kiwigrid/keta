'use strict';

/**
 * @name keta.utils.Country
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2016
 * @module keta.utils.Country
 * @description
 * <p>
 *   Country service utility for cross-component usage.
 * </p>
 */

angular.module('keta.utils.Country', [])

	// message keys with default values
	// last updated: Tue, 25 Oct 2016 12:43:35 GMT
	.constant('ketaCountryUtilsMessageKeys', {
		'de_DE': {
			'AF': 'Afghanistan',
			'EG': 'Ägypten',
			'AX': 'Åland-Inseln',
			'AL': 'Albanien',
			'DZ': 'Algerien',
			'UM': 'Amerikanisch-Ozeanien',
			'AS': 'Amerikanisch-Samoa',
			'VI': 'Amerikanische Jungferninseln',
			'AD': 'Andorra',
			'AO': 'Angola',
			'AI': 'Anguilla',
			'AQ': 'Antarktis',
			'AG': 'Antigua und Barbuda',
			'GQ': 'Äquatorialguinea',
			'AR': 'Argentinien',
			'AM': 'Armenien',
			'AW': 'Aruba',
			'AC': 'Ascension',
			'AZ': 'Aserbaidschan',
			'ET': 'Äthiopien',
			'AU': 'Australien',
			'BS': 'Bahamas',
			'BH': 'Bahrain',
			'BD': 'Bangladesch',
			'BB': 'Barbados',
			'BY': 'Belarus',
			'BE': 'Belgien',
			'BZ': 'Belize',
			'BJ': 'Benin',
			'BM': 'Bermuda',
			'BT': 'Bhutan',
			'BO': 'Bolivien',
			'BA': 'Bosnien und Herzegowina',
			'BW': 'Botsuana',
			'BR': 'Brasilien',
			'VG': 'Britische Jungferninseln',
			'IO': 'Britisches Territorium im Indischen Ozean',
			'BN': 'Brunei Darussalam',
			'BG': 'Bulgarien',
			'BF': 'Burkina Faso',
			'BI': 'Burundi',
			'EA': 'Ceuta und Melilla',
			'CL': 'Chile',
			'CN': 'China',
			'CK': 'Cookinseln',
			'CR': 'Costa Rica',
			'CI': 'Côte d’Ivoire',
			'CW': 'Curaçao',
			'DK': 'Dänemark',
			'KP': 'Demokratische Volksrepublik Korea',
			'DE': 'Deutschland',
			'DG': 'Diego Garcia',
			'DM': 'Dominica',
			'DO': 'Dominikanische Republik',
			'DJ': 'Dschibuti',
			'EC': 'Ecuador',
			'SV': 'El Salvador',
			'ER': 'Eritrea',
			'EE': 'Estland',
			'FK': 'Falklandinseln',
			'FO': 'Färöer',
			'FJ': 'Fidschi',
			'FI': 'Finnland',
			'FR': 'Frankreich',
			'GF': 'Französisch-Guayana',
			'PF': 'Französisch-Polynesien',
			'TF': 'Französische Süd- und Antarktisgebiete',
			'GA': 'Gabun',
			'GM': 'Gambia',
			'GE': 'Georgien',
			'GH': 'Ghana',
			'GI': 'Gibraltar',
			'GD': 'Grenada',
			'GR': 'Griechenland',
			'GL': 'Grönland',
			'GP': 'Guadeloupe',
			'GU': 'Guam',
			'GT': 'Guatemala',
			'GG': 'Guernsey',
			'GN': 'Guinea',
			'GW': 'Guinea-Bissau',
			'GY': 'Guyana',
			'HT': 'Haiti',
			'HN': 'Honduras',
			'IN': 'Indien',
			'ID': 'Indonesien',
			'IQ': 'Irak',
			'IR': 'Iran',
			'IE': 'Irland',
			'IS': 'Island',
			'IM': 'Isle of Man',
			'IL': 'Israel',
			'IT': 'Italien',
			'JM': 'Jamaika',
			'JP': 'Japan',
			'YE': 'Jemen',
			'JE': 'Jersey',
			'JO': 'Jordanien',
			'KY': 'Kaimaninseln',
			'KH': 'Kambodscha',
			'CM': 'Kamerun',
			'CA': 'Kanada',
			'IC': 'Kanarische Inseln',
			'CV': 'Kap Verde',
			'BQ': 'Karibische Niederlande',
			'KZ': 'Kasachstan',
			'QA': 'Katar',
			'KE': 'Kenia',
			'KG': 'Kirgisistan',
			'KI': 'Kiribati',
			'CC': 'Kokosinseln',
			'CO': 'Kolumbien',
			'KM': 'Komoren',
			'CG': 'Kongo-Brazzaville',
			'CD': 'Kongo-Kinshasa',
			'XK': 'Kosovo',
			'HR': 'Kroatien',
			'CU': 'Kuba',
			'KW': 'Kuwait',
			'LA': 'Laos',
			'LS': 'Lesotho',
			'LV': 'Lettland',
			'LB': 'Libanon',
			'LR': 'Liberia',
			'LY': 'Libyen',
			'LI': 'Liechtenstein',
			'LT': 'Litauen',
			'LU': 'Luxemburg',
			'MG': 'Madagaskar',
			'MW': 'Malawi',
			'MY': 'Malaysia',
			'MV': 'Malediven',
			'ML': 'Mali',
			'MT': 'Malta',
			'MA': 'Marokko',
			'MH': 'Marshallinseln',
			'MQ': 'Martinique',
			'MR': 'Mauretanien',
			'MU': 'Mauritius',
			'YT': 'Mayotte',
			'MK': 'Mazedonien',
			'MX': 'Mexiko',
			'FM': 'Mikronesien',
			'MC': 'Monaco',
			'MN': 'Mongolei',
			'ME': 'Montenegro',
			'MS': 'Montserrat',
			'MZ': 'Mosambik',
			'MM': 'Myanmar',
			'NA': 'Namibia',
			'NR': 'Nauru',
			'NP': 'Nepal',
			'NC': 'Neukaledonien',
			'NZ': 'Neuseeland',
			'NI': 'Nicaragua',
			'NL': 'Niederlande',
			'NE': 'Niger',
			'NG': 'Nigeria',
			'NU': 'Niue',
			'MP': 'Nördliche Marianen',
			'NF': 'Norfolkinsel',
			'NO': 'Norwegen',
			'OM': 'Oman',
			'AT': 'Österreich',
			'PK': 'Pakistan',
			'PS': 'Palästinensische Autonomiegebiete',
			'PW': 'Palau',
			'PA': 'Panama',
			'PG': 'Papua-Neuguinea',
			'PY': 'Paraguay',
			'PE': 'Peru',
			'PH': 'Philippinen',
			'PN': 'Pitcairninseln',
			'PL': 'Polen',
			'PT': 'Portugal',
			'PR': 'Puerto Rico',
			'KR': 'Republik Korea',
			'MD': 'Republik Moldau',
			'RE': 'Réunion',
			'RW': 'Ruanda',
			'RO': 'Rumänien',
			'RU': 'Russische Föderation',
			'SB': 'Salomonen',
			'ZM': 'Sambia',
			'WS': 'Samoa',
			'SM': 'San Marino',
			'ST': 'São Tomé und Príncipe',
			'SA': 'Saudi-Arabien',
			'SE': 'Schweden',
			'CH': 'Schweiz',
			'SN': 'Senegal',
			'RS': 'Serbien',
			'SC': 'Seychellen',
			'SL': 'Sierra Leone',
			'ZW': 'Simbabwe',
			'SG': 'Singapur',
			'SX': 'Sint Maarten',
			'SK': 'Slowakei',
			'SI': 'Slowenien',
			'SO': 'Somalia',
			'MO': 'Sonderverwaltungsregion Macau',
			'HK': 'Sonderverwaltungszone Hongkong',
			'ES': 'Spanien',
			'LK': 'Sri Lanka',
			'BL': 'St. Barthélemy',
			'SH': 'St. Helena',
			'KN': 'St. Kitts und Nevis',
			'LC': 'St. Lucia',
			'MF': 'St. Martin',
			'PM': 'St. Pierre und Miquelon',
			'VC': 'St. Vincent und die Grenadinen',
			'ZA': 'Südafrika',
			'SD': 'Sudan',
			'GS': 'Südgeorgien und die Südlichen Sandwichinseln',
			'SS': 'Südsudan',
			'SR': 'Suriname',
			'SJ': 'Svalbard und Jan Mayen',
			'SZ': 'Swasiland',
			'SY': 'Syrien',
			'TJ': 'Tadschikistan',
			'TW': 'Taiwan',
			'TZ': 'Tansania',
			'TH': 'Thailand',
			'TL': 'Timor-Leste',
			'TG': 'Togo',
			'TK': 'Tokelau',
			'TO': 'Tonga',
			'TT': 'Trinidad und Tobago',
			'TA': 'Tristan da Cunha',
			'TD': 'Tschad',
			'CZ': 'Tschechische Republik',
			'TN': 'Tunesien',
			'TR': 'Türkei',
			'TM': 'Turkmenistan',
			'TC': 'Turks- und Caicosinseln',
			'TV': 'Tuvalu',
			'UG': 'Uganda',
			'UA': 'Ukraine',
			'HU': 'Ungarn',
			'UY': 'Uruguay',
			'UZ': 'Usbekistan',
			'VU': 'Vanuatu',
			'VA': 'Vatikanstadt',
			'VE': 'Venezuela',
			'AE': 'Vereinigte Arabische Emirate',
			'US': 'Vereinigte Staaten',
			'GB': 'Vereinigtes Königreich',
			'VN': 'Vietnam',
			'WF': 'Wallis und Futuna',
			'CX': 'Weihnachtsinsel',
			'EH': 'Westsahara',
			'CF': 'Zentralafrikanische Republik',
			'CY': 'Zypern'
		},
		'en_GB': {
			'AF': 'Afghanistan',
			'AX': 'Åland Islands',
			'AL': 'Albania',
			'DZ': 'Algeria',
			'AS': 'American Samoa',
			'AD': 'Andorra',
			'AO': 'Angola',
			'AI': 'Anguilla',
			'AQ': 'Antarctica',
			'AG': 'Antigua and Barbuda',
			'AR': 'Argentina',
			'AM': 'Armenia',
			'AW': 'Aruba',
			'AC': 'Ascension Island',
			'AU': 'Australia',
			'AT': 'Austria',
			'AZ': 'Azerbaijan',
			'BS': 'Bahamas',
			'BH': 'Bahrain',
			'BD': 'Bangladesh',
			'BB': 'Barbados',
			'BY': 'Belarus',
			'BE': 'Belgium',
			'BZ': 'Belize',
			'BJ': 'Benin',
			'BM': 'Bermuda',
			'BT': 'Bhutan',
			'BO': 'Bolivia',
			'BA': 'Bosnia and Herzegovina',
			'BW': 'Botswana',
			'BR': 'Brazil',
			'IO': 'British Indian Ocean Territory',
			'VG': 'British Virgin Islands',
			'BN': 'Brunei',
			'BG': 'Bulgaria',
			'BF': 'Burkina Faso',
			'BI': 'Burundi',
			'KH': 'Cambodia',
			'CM': 'Cameroon',
			'CA': 'Canada',
			'IC': 'Canary Islands',
			'CV': 'Cape Verde',
			'BQ': 'Caribbean Netherlands',
			'KY': 'Cayman Islands',
			'CF': 'Central African Republic',
			'EA': 'Ceuta and Melilla',
			'TD': 'Chad',
			'CL': 'Chile',
			'CN': 'China',
			'CX': 'Christmas Island',
			'CC': 'Cocos (Keeling) Islands',
			'CO': 'Colombia',
			'KM': 'Comoros',
			'CG': 'Congo - Brazzaville',
			'CD': 'Congo - Kinshasa',
			'CK': 'Cook Islands',
			'CR': 'Costa Rica',
			'CI': 'Côte d’Ivoire',
			'HR': 'Croatia',
			'CU': 'Cuba',
			'CW': 'Curaçao',
			'CY': 'Cyprus',
			'CZ': 'Czech Republic',
			'DK': 'Denmark',
			'DG': 'Diego Garcia',
			'DJ': 'Djibouti',
			'DM': 'Dominica',
			'DO': 'Dominican Republic',
			'EC': 'Ecuador',
			'EG': 'Egypt',
			'SV': 'El Salvador',
			'GQ': 'Equatorial Guinea',
			'ER': 'Eritrea',
			'EE': 'Estonia',
			'ET': 'Ethiopia',
			'FK': 'Falkland Islands',
			'FO': 'Faroe Islands',
			'FJ': 'Fiji',
			'FI': 'Finland',
			'FR': 'France',
			'GF': 'French Guiana',
			'PF': 'French Polynesia',
			'TF': 'French Southern Territories',
			'GA': 'Gabon',
			'GM': 'Gambia',
			'GE': 'Georgia',
			'DE': 'Germany',
			'GH': 'Ghana',
			'GI': 'Gibraltar',
			'GR': 'Greece',
			'GL': 'Greenland',
			'GD': 'Grenada',
			'GP': 'Guadeloupe',
			'GU': 'Guam',
			'GT': 'Guatemala',
			'GG': 'Guernsey',
			'GN': 'Guinea',
			'GW': 'Guinea-Bissau',
			'GY': 'Guyana',
			'HT': 'Haiti',
			'HN': 'Honduras',
			'HK': 'Hong Kong SAR China',
			'HU': 'Hungary',
			'IS': 'Iceland',
			'IN': 'India',
			'ID': 'Indonesia',
			'IR': 'Iran',
			'IQ': 'Iraq',
			'IE': 'Ireland',
			'IM': 'Isle of Man',
			'IL': 'Israel',
			'IT': 'Italy',
			'JM': 'Jamaica',
			'JP': 'Japan',
			'JE': 'Jersey',
			'JO': 'Jordan',
			'KZ': 'Kazakhstan',
			'KE': 'Kenya',
			'KI': 'Kiribati',
			'XK': 'Kosovo',
			'KW': 'Kuwait',
			'KG': 'Kyrgyzstan',
			'LA': 'Laos',
			'LV': 'Latvia',
			'LB': 'Lebanon',
			'LS': 'Lesotho',
			'LR': 'Liberia',
			'LY': 'Libya',
			'LI': 'Liechtenstein',
			'LT': 'Lithuania',
			'LU': 'Luxembourg',
			'MO': 'Macau SAR China',
			'MK': 'Macedonia',
			'MG': 'Madagascar',
			'MW': 'Malawi',
			'MY': 'Malaysia',
			'MV': 'Maldives',
			'ML': 'Mali',
			'MT': 'Malta',
			'MH': 'Marshall Islands',
			'MQ': 'Martinique',
			'MR': 'Mauritania',
			'MU': 'Mauritius',
			'YT': 'Mayotte',
			'MX': 'Mexico',
			'FM': 'Micronesia',
			'MD': 'Moldova',
			'MC': 'Monaco',
			'MN': 'Mongolia',
			'ME': 'Montenegro',
			'MS': 'Montserrat',
			'MA': 'Morocco',
			'MZ': 'Mozambique',
			'MM': 'Myanmar (Burma)',
			'NA': 'Namibia',
			'NR': 'Nauru',
			'NP': 'Nepal',
			'NL': 'Netherlands',
			'NC': 'New Caledonia',
			'NZ': 'New Zealand',
			'NI': 'Nicaragua',
			'NE': 'Niger',
			'NG': 'Nigeria',
			'NU': 'Niue',
			'NF': 'Norfolk Island',
			'KP': 'North Korea',
			'MP': 'Northern Mariana Islands',
			'NO': 'Norway',
			'OM': 'Oman',
			'PK': 'Pakistan',
			'PW': 'Palau',
			'PS': 'Palestinian Territories',
			'PA': 'Panama',
			'PG': 'Papua New Guinea',
			'PY': 'Paraguay',
			'PE': 'Peru',
			'PH': 'Philippines',
			'PN': 'Pitcairn Islands',
			'PL': 'Poland',
			'PT': 'Portugal',
			'PR': 'Puerto Rico',
			'QA': 'Qatar',
			'RE': 'Réunion',
			'RO': 'Romania',
			'RU': 'Russia',
			'RW': 'Rwanda',
			'BL': 'Saint Barthélemy',
			'SH': 'Saint Helena',
			'KN': 'Saint Kitts and Nevis',
			'LC': 'Saint Lucia',
			'MF': 'Saint Martin',
			'PM': 'Saint Pierre and Miquelon',
			'WS': 'Samoa',
			'SM': 'San Marino',
			'ST': 'São Tomé and Príncipe',
			'SA': 'Saudi Arabia',
			'SN': 'Senegal',
			'RS': 'Serbia',
			'SC': 'Seychelles',
			'SL': 'Sierra Leone',
			'SG': 'Singapore',
			'SX': 'Sint Maarten',
			'SK': 'Slovakia',
			'SI': 'Slovenia',
			'SB': 'Solomon Islands',
			'SO': 'Somalia',
			'ZA': 'South Africa',
			'GS': 'South Georgia & South Sandwich Islands',
			'KR': 'South Korea',
			'SS': 'South Sudan',
			'ES': 'Spain',
			'LK': 'Sri Lanka',
			'VC': 'St. Vincent & Grenadines',
			'SD': 'Sudan',
			'SR': 'Suriname',
			'SJ': 'Svalbard and Jan Mayen',
			'SZ': 'Swaziland',
			'SE': 'Sweden',
			'CH': 'Switzerland',
			'SY': 'Syria',
			'TW': 'Taiwan',
			'TJ': 'Tajikistan',
			'TZ': 'Tanzania',
			'TH': 'Thailand',
			'TL': 'Timor-Leste',
			'TG': 'Togo',
			'TK': 'Tokelau',
			'TO': 'Tonga',
			'TT': 'Trinidad and Tobago',
			'TA': 'Tristan da Cunha',
			'TN': 'Tunisia',
			'TR': 'Turkey',
			'TM': 'Turkmenistan',
			'TC': 'Turks and Caicos Islands',
			'TV': 'Tuvalu',
			'UM': 'U.S. Outlying Islands',
			'VI': 'U.S. Virgin Islands',
			'UG': 'Uganda',
			'UA': 'Ukraine',
			'AE': 'United Arab Emirates',
			'GB': 'United Kingdom',
			'US': 'United States',
			'UY': 'Uruguay',
			'UZ': 'Uzbekistan',
			'VU': 'Vanuatu',
			'VA': 'Vatican City',
			'VE': 'Venezuela',
			'VN': 'Vietnam',
			'WF': 'Wallis and Futuna',
			'EH': 'Western Sahara',
			'YE': 'Yemen',
			'ZM': 'Zambia',
			'ZW': 'Zimbabwe'
		},
		'es_ES': {
			'AF': 'Afganistán',
			'AL': 'Albania',
			'DE': 'Alemania',
			'AD': 'Andorra',
			'AO': 'Angola',
			'AI': 'Anguila',
			'AQ': 'Antártida',
			'AG': 'Antigua y Barbuda',
			'SA': 'Arabia Saudí',
			'DZ': 'Argelia',
			'AR': 'Argentina',
			'AM': 'Armenia',
			'AW': 'Aruba',
			'AU': 'Australia',
			'AT': 'Austria',
			'AZ': 'Azerbaiyán',
			'BS': 'Bahamas',
			'BD': 'Bangladés',
			'BB': 'Barbados',
			'BH': 'Baréin',
			'BE': 'Bélgica',
			'BZ': 'Belice',
			'BJ': 'Benín',
			'BM': 'Bermudas',
			'BY': 'Bielorrusia',
			'BO': 'Bolivia',
			'BA': 'Bosnia-Herzegovina',
			'BW': 'Botsuana',
			'BR': 'Brasil',
			'BN': 'Brunéi',
			'BG': 'Bulgaria',
			'BF': 'Burkina Faso',
			'BI': 'Burundi',
			'BT': 'Bután',
			'CV': 'Cabo Verde',
			'KH': 'Camboya',
			'CM': 'Camerún',
			'CA': 'Canadá',
			'BQ': 'Caribe neerlandés',
			'QA': 'Catar',
			'EA': 'Ceuta y Melilla',
			'TD': 'Chad',
			'CL': 'Chile',
			'CN': 'China',
			'CY': 'Chipre',
			'VA': 'Ciudad del Vaticano',
			'CO': 'Colombia',
			'KM': 'Comoras',
			'KP': 'Corea del Norte',
			'KR': 'Corea del Sur',
			'CI': 'Costa de Marfil',
			'CR': 'Costa Rica',
			'HR': 'Croacia',
			'CU': 'Cuba',
			'CW': 'Curazao',
			'DG': 'Diego García',
			'DK': 'Dinamarca',
			'DM': 'Dominica',
			'EC': 'Ecuador',
			'EG': 'Egipto',
			'SV': 'El Salvador',
			'AE': 'Emiratos Árabes Unidos',
			'ER': 'Eritrea',
			'SK': 'Eslovaquia',
			'SI': 'Eslovenia',
			'ES': 'España',
			'US': 'Estados Unidos',
			'EE': 'Estonia',
			'ET': 'Etiopía',
			'PH': 'Filipinas',
			'FI': 'Finlandia',
			'FJ': 'Fiyi',
			'FR': 'Francia',
			'GA': 'Gabón',
			'GM': 'Gambia',
			'GE': 'Georgia',
			'GH': 'Ghana',
			'GI': 'Gibraltar',
			'GD': 'Granada',
			'GR': 'Grecia',
			'GL': 'Groenlandia',
			'GP': 'Guadalupe',
			'GU': 'Guam',
			'GT': 'Guatemala',
			'GF': 'Guayana Francesa',
			'GG': 'Guernesey',
			'GN': 'Guinea',
			'GQ': 'Guinea Ecuatorial',
			'GW': 'Guinea-Bisáu',
			'GY': 'Guyana',
			'HT': 'Haití',
			'HN': 'Honduras',
			'HU': 'Hungría',
			'IN': 'India',
			'ID': 'Indonesia',
			'IR': 'Irán',
			'IQ': 'Iraq',
			'IE': 'Irlanda',
			'CX': 'Isla Christmas',
			'AC': 'Isla de la Ascensión',
			'IM': 'Isla de Man',
			'NU': 'Isla Niue',
			'NF': 'Isla Norfolk',
			'IS': 'Islandia',
			'AX': 'Islas Åland',
			'KY': 'Islas Caimán',
			'IC': 'islas Canarias',
			'CC': 'Islas Cocos',
			'CK': 'Islas Cook',
			'FO': 'Islas Feroe',
			'GS': 'Islas Georgia del Sur y Sandwich del Sur',
			'FK': 'Islas Malvinas',
			'MP': 'Islas Marianas del Norte',
			'MH': 'Islas Marshall',
			'UM': 'Islas menores alejadas de EE. UU.',
			'PN': 'Islas Pitcairn',
			'SB': 'Islas Salomón',
			'TC': 'Islas Turcas y Caicos',
			'VG': 'Islas Vírgenes Británicas',
			'VI': 'Islas Vírgenes de EE. UU.',
			'IL': 'Israel',
			'IT': 'Italia',
			'JM': 'Jamaica',
			'JP': 'Japón',
			'JE': 'Jersey',
			'JO': 'Jordania',
			'KZ': 'Kazajistán',
			'KE': 'Kenia',
			'KG': 'Kirguistán',
			'KI': 'Kiribati',
			'XK': 'Kosovo',
			'KW': 'Kuwait',
			'LA': 'Laos',
			'LS': 'Lesoto',
			'LV': 'Letonia',
			'LB': 'Líbano',
			'LR': 'Liberia',
			'LY': 'Libia',
			'LI': 'Liechtenstein',
			'LT': 'Lituania',
			'LU': 'Luxemburgo',
			'MK': 'Macedonia',
			'MG': 'Madagascar',
			'MY': 'Malasia',
			'MW': 'Malaui',
			'MV': 'Maldivas',
			'ML': 'Mali',
			'MT': 'Malta',
			'MA': 'Marruecos',
			'MQ': 'Martinica',
			'MU': 'Mauricio',
			'MR': 'Mauritania',
			'YT': 'Mayotte',
			'MX': 'México',
			'FM': 'Micronesia',
			'MD': 'Moldavia',
			'MC': 'Mónaco',
			'MN': 'Mongolia',
			'ME': 'Montenegro',
			'MS': 'Montserrat',
			'MZ': 'Mozambique',
			'MM': 'Myanmar (Birmania)',
			'NA': 'Namibia',
			'NR': 'Nauru',
			'NP': 'Nepal',
			'NI': 'Nicaragua',
			'NE': 'Níger',
			'NG': 'Nigeria',
			'NO': 'Noruega',
			'NC': 'Nueva Caledonia',
			'NZ': 'Nueva Zelanda',
			'OM': 'Omán',
			'NL': 'Países Bajos',
			'PK': 'Pakistán',
			'PW': 'Palau',
			'PA': 'Panamá',
			'PG': 'Papúa Nueva Guinea',
			'PY': 'Paraguay',
			'PE': 'Perú',
			'PF': 'Polinesia Francesa',
			'PL': 'Polonia',
			'PT': 'Portugal',
			'PR': 'Puerto Rico',
			'HK': 'RAE de Hong Kong (China)',
			'MO': 'RAE de Macao (China)',
			'GB': 'Reino Unido',
			'CF': 'República Centroafricana',
			'CZ': 'República Checa',
			'CG': 'República del Congo',
			'CD': 'República Democrática del Congo',
			'DO': 'República Dominicana',
			'RE': 'Reunión',
			'RW': 'Ruanda',
			'RO': 'Rumanía',
			'RU': 'Rusia',
			'EH': 'Sáhara Occidental',
			'WS': 'Samoa',
			'AS': 'Samoa Americana',
			'BL': 'San Bartolomé',
			'KN': 'San Cristóbal y Nieves',
			'SM': 'San Marino',
			'MF': 'San Martín',
			'PM': 'San Pedro y Miquelón',
			'VC': 'San Vicente y las Granadinas',
			'SH': 'Santa Elena',
			'LC': 'Santa Lucía',
			'ST': 'Santo Tomé y Príncipe',
			'SN': 'Senegal',
			'RS': 'Serbia',
			'SC': 'Seychelles',
			'SL': 'Sierra Leona',
			'SG': 'Singapur',
			'SX': 'Sint Maarten',
			'SY': 'Siria',
			'SO': 'Somalia',
			'LK': 'Sri Lanka',
			'SZ': 'Suazilandia',
			'ZA': 'Sudáfrica',
			'SD': 'Sudán',
			'SS': 'Sudán del Sur',
			'SE': 'Suecia',
			'CH': 'Suiza',
			'SR': 'Surinam',
			'SJ': 'Svalbard y Jan Mayen',
			'TH': 'Tailandia',
			'TW': 'Taiwán',
			'TZ': 'Tanzania',
			'TJ': 'Tayikistán',
			'IO': 'Territorio Británico del Océano Índico',
			'TF': 'Territorios Australes Franceses',
			'PS': 'Territorios Palestinos',
			'TL': 'Timor Oriental',
			'TG': 'Togo',
			'TK': 'Tokelau',
			'TO': 'Tonga',
			'TT': 'Trinidad y Tobago',
			'TA': 'Tristán da Cunha',
			'TN': 'Túnez',
			'TM': 'Turkmenistán',
			'TR': 'Turquía',
			'TV': 'Tuvalu',
			'UA': 'Ucrania',
			'UG': 'Uganda',
			'UY': 'Uruguay',
			'UZ': 'Uzbekistán',
			'VU': 'Vanuatu',
			'VE': 'Venezuela',
			'VN': 'Vietnam',
			'WF': 'Wallis y Futuna',
			'YE': 'Yemen',
			'DJ': 'Yibuti',
			'ZM': 'Zambia',
			'ZW': 'Zimbabue'
		},
		'fr_FR': {
			'AF': 'Afghanistan',
			'ZA': 'Afrique du Sud',
			'AL': 'Albanie',
			'DZ': 'Algérie',
			'DE': 'Allemagne',
			'AD': 'Andorre',
			'AO': 'Angola',
			'AI': 'Anguilla',
			'AQ': 'Antarctique',
			'AG': 'Antigua-et-Barbuda',
			'SA': 'Arabie saoudite',
			'AR': 'Argentine',
			'AM': 'Arménie',
			'AW': 'Aruba',
			'AU': 'Australie',
			'AT': 'Autriche',
			'AZ': 'Azerbaïdjan',
			'BS': 'Bahamas',
			'BH': 'Bahreïn',
			'BD': 'Bangladesh',
			'BB': 'Barbade',
			'BE': 'Belgique',
			'BZ': 'Belize',
			'BJ': 'Bénin',
			'BM': 'Bermudes',
			'BT': 'Bhoutan',
			'BY': 'Biélorussie',
			'BO': 'Bolivie',
			'BA': 'Bosnie-Herzégovine',
			'BW': 'Botswana',
			'BR': 'Brésil',
			'BN': 'Brunéi Darussalam',
			'BG': 'Bulgarie',
			'BF': 'Burkina Faso',
			'BI': 'Burundi',
			'KH': 'Cambodge',
			'CM': 'Cameroun',
			'CA': 'Canada',
			'CV': 'Cap-Vert',
			'EA': 'Ceuta et Melilla',
			'CL': 'Chili',
			'CN': 'Chine',
			'CY': 'Chypre',
			'CO': 'Colombie',
			'KM': 'Comores',
			'CG': 'Congo-Brazzaville',
			'CD': 'Congo-Kinshasa',
			'KP': 'Corée du Nord',
			'KR': 'Corée du Sud',
			'CR': 'Costa Rica',
			'CI': 'Côte d’Ivoire',
			'HR': 'Croatie',
			'CU': 'Cuba',
			'CW': 'Curaçao',
			'DK': 'Danemark',
			'DG': 'Diego Garcia',
			'DJ': 'Djibouti',
			'DM': 'Dominique',
			'EG': 'Égypte',
			'SV': 'El Salvador',
			'AE': 'Émirats arabes unis',
			'EC': 'Équateur',
			'ER': 'Érythrée',
			'ES': 'Espagne',
			'EE': 'Estonie',
			'VA': 'État de la Cité du Vatican',
			'FM': 'États fédérés de Micronésie',
			'US': 'États-Unis',
			'ET': 'Éthiopie',
			'FJ': 'Fidji',
			'FI': 'Finlande',
			'FR': 'France',
			'GA': 'Gabon',
			'GM': 'Gambie',
			'GE': 'Géorgie',
			'GH': 'Ghana',
			'GI': 'Gibraltar',
			'GR': 'Grèce',
			'GD': 'Grenade',
			'GL': 'Groenland',
			'GP': 'Guadeloupe',
			'GU': 'Guam',
			'GT': 'Guatemala',
			'GG': 'Guernesey',
			'GN': 'Guinée',
			'GQ': 'Guinée équatoriale',
			'GW': 'Guinée-Bissau',
			'GY': 'Guyana',
			'GF': 'Guyane française',
			'HT': 'Haïti',
			'HN': 'Honduras',
			'HU': 'Hongrie',
			'CX': 'Île Christmas',
			'AC': 'Île de l’Ascension',
			'IM': 'Île de Man',
			'NF': 'Île Norfolk',
			'AX': 'Îles Åland',
			'KY': 'Îles Caïmans',
			'IC': 'Îles Canaries',
			'CC': 'Îles Cocos',
			'CK': 'Îles Cook',
			'FO': 'Îles Féroé',
			'GS': 'Îles Géorgie du Sud et Sandwich du Sud',
			'FK': 'Îles Malouines',
			'MP': 'Îles Mariannes du Nord',
			'MH': 'Îles Marshall',
			'UM': 'Îles mineures éloignées des États-Unis',
			'SB': 'Îles Salomon',
			'TC': 'Îles Turques-et-Caïques',
			'VG': 'Îles Vierges britanniques',
			'VI': 'Îles Vierges des États-Unis',
			'IN': 'Inde',
			'ID': 'Indonésie',
			'IQ': 'Irak',
			'IR': 'Iran',
			'IE': 'Irlande',
			'IS': 'Islande',
			'IL': 'Israël',
			'IT': 'Italie',
			'JM': 'Jamaïque',
			'JP': 'Japon',
			'JE': 'Jersey',
			'JO': 'Jordanie',
			'KZ': 'Kazakhstan',
			'KE': 'Kenya',
			'KG': 'Kirghizistan',
			'KI': 'Kiribati',
			'XK': 'Kosovo',
			'KW': 'Koweït',
			'RE': 'La Réunion',
			'LA': 'Laos',
			'LS': 'Lesotho',
			'LV': 'Lettonie',
			'LB': 'Liban',
			'LR': 'Libéria',
			'LY': 'Libye',
			'LI': 'Liechtenstein',
			'LT': 'Lituanie',
			'LU': 'Luxembourg',
			'MK': 'Macédoine',
			'MG': 'Madagascar',
			'MY': 'Malaisie',
			'MW': 'Malawi',
			'MV': 'Maldives',
			'ML': 'Mali',
			'MT': 'Malte',
			'MA': 'Maroc',
			'MQ': 'Martinique',
			'MU': 'Maurice',
			'MR': 'Mauritanie',
			'YT': 'Mayotte',
			'MX': 'Mexique',
			'MD': 'Moldavie',
			'MC': 'Monaco',
			'MN': 'Mongolie',
			'ME': 'Monténégro',
			'MS': 'Montserrat',
			'MZ': 'Mozambique',
			'MM': 'Myanmar',
			'NA': 'Namibie',
			'NR': 'Nauru',
			'NP': 'Népal',
			'NI': 'Nicaragua',
			'NE': 'Niger',
			'NG': 'Nigéria',
			'NU': 'Niue',
			'NO': 'Norvège',
			'NC': 'Nouvelle-Calédonie',
			'NZ': 'Nouvelle-Zélande',
			'OM': 'Oman',
			'UG': 'Ouganda',
			'UZ': 'Ouzbékistan',
			'PK': 'Pakistan',
			'PW': 'Palaos',
			'PA': 'Panama',
			'PG': 'Papouasie-Nouvelle-Guinée',
			'PY': 'Paraguay',
			'NL': 'Pays-Bas',
			'BQ': 'Pays-Bas caribéens',
			'PE': 'Pérou',
			'PH': 'Philippines',
			'PN': 'Pitcairn',
			'PL': 'Pologne',
			'PF': 'Polynésie française',
			'PR': 'Porto Rico',
			'PT': 'Portugal',
			'QA': 'Qatar',
			'HK': 'R.A.S. chinoise de Hong Kong',
			'MO': 'R.A.S. chinoise de Macao',
			'CF': 'République centrafricaine',
			'DO': 'République dominicaine',
			'CZ': 'République tchèque',
			'RO': 'Roumanie',
			'GB': 'Royaume-Uni',
			'RU': 'Russie',
			'RW': 'Rwanda',
			'EH': 'Sahara occidental',
			'BL': 'Saint-Barthélemy',
			'KN': 'Saint-Christophe-et-Niévès',
			'SM': 'Saint-Marin',
			'MF': 'Saint-Martin (partie française)',
			'SX': 'Saint-Martin (partie néerlandaise)',
			'PM': 'Saint-Pierre-et-Miquelon',
			'VC': 'Saint-Vincent-et-les-Grenadines',
			'SH': 'Sainte-Hélène',
			'LC': 'Sainte-Lucie',
			'WS': 'Samoa',
			'AS': 'Samoa américaines',
			'ST': 'Sao Tomé-et-Principe',
			'SN': 'Sénégal',
			'RS': 'Serbie',
			'SC': 'Seychelles',
			'SL': 'Sierra Leone',
			'SG': 'Singapour',
			'SK': 'Slovaquie',
			'SI': 'Slovénie',
			'SO': 'Somalie',
			'SD': 'Soudan',
			'SS': 'Soudan du Sud',
			'LK': 'Sri Lanka',
			'SE': 'Suède',
			'CH': 'Suisse',
			'SR': 'Suriname',
			'SJ': 'Svalbard et Jan Mayen',
			'SZ': 'Swaziland',
			'SY': 'Syrie',
			'TJ': 'Tadjikistan',
			'TW': 'Taïwan',
			'TZ': 'Tanzanie',
			'TD': 'Tchad',
			'TF': 'Terres australes françaises',
			'IO': 'Territoire britannique de l’océan Indien',
			'PS': 'Territoires palestiniens',
			'TH': 'Thaïlande',
			'TL': 'Timor oriental',
			'TG': 'Togo',
			'TK': 'Tokelau',
			'TO': 'Tonga',
			'TT': 'Trinité-et-Tobago',
			'TA': 'Tristan da Cunha',
			'TN': 'Tunisie',
			'TM': 'Turkménistan',
			'TR': 'Turquie',
			'TV': 'Tuvalu',
			'UA': 'Ukraine',
			'UY': 'Uruguay',
			'VU': 'Vanuatu',
			'VE': 'Venezuela',
			'VN': 'Vietnam',
			'WF': 'Wallis-et-Futuna',
			'YE': 'Yémen',
			'ZM': 'Zambie',
			'ZW': 'Zimbabwe'
		},
		'it_IT': {
			'AF': 'Afghanistan',
			'AL': 'Albania',
			'DZ': 'Algeria',
			'AD': 'Andorra',
			'AO': 'Angola',
			'AI': 'Anguilla',
			'AQ': 'Antartide',
			'AG': 'Antigua e Barbuda',
			'SA': 'Arabia Saudita',
			'AR': 'Argentina',
			'AM': 'Armenia',
			'AW': 'Aruba',
			'AU': 'Australia',
			'AT': 'Austria',
			'AZ': 'Azerbaigian',
			'BS': 'Bahamas',
			'BH': 'Bahrein',
			'BD': 'Bangladesh',
			'BB': 'Barbados',
			'BE': 'Belgio',
			'BZ': 'Belize',
			'BJ': 'Benin',
			'BM': 'Bermuda',
			'BT': 'Bhutan',
			'BY': 'Bielorussia',
			'BO': 'Bolivia',
			'BA': 'Bosnia-Erzegovina',
			'BW': 'Botswana',
			'BR': 'Brasile',
			'BN': 'Brunei',
			'BG': 'Bulgaria',
			'BF': 'Burkina Faso',
			'BI': 'Burundi',
			'KH': 'Cambogia',
			'CM': 'Camerun',
			'CA': 'Canada',
			'CV': 'Capo Verde',
			'BQ': 'Caraibi Olandesi',
			'EA': 'Ceuta e Melilla',
			'TD': 'Ciad',
			'CL': 'Cile',
			'CN': 'Cina',
			'CY': 'Cipro',
			'VA': 'Città del Vaticano',
			'CO': 'Colombia',
			'KM': 'Comore',
			'CD': 'Congo - Kinshasa',
			'CG': 'Congo-Brazzaville',
			'KP': 'Corea del Nord',
			'KR': 'Corea del Sud',
			'CI': 'Costa d’Avorio',
			'CR': 'Costa Rica',
			'HR': 'Croazia',
			'CU': 'Cuba',
			'CW': 'Curaçao',
			'DK': 'Danimarca',
			'DG': 'Diego Garcia',
			'DM': 'Dominica',
			'EC': 'Ecuador',
			'EG': 'Egitto',
			'SV': 'El Salvador',
			'AE': 'Emirati Arabi Uniti',
			'ER': 'Eritrea',
			'EE': 'Estonia',
			'ET': 'Etiopia',
			'RU': 'Federazione Russa',
			'FJ': 'Figi',
			'PH': 'Filippine',
			'FI': 'Finlandia',
			'FR': 'Francia',
			'GA': 'Gabon',
			'GM': 'Gambia',
			'GE': 'Georgia',
			'GS': 'Georgia del Sud e isole Sandwich meridionali',
			'DE': 'Germania',
			'GH': 'Ghana',
			'JM': 'Giamaica',
			'JP': 'Giappone',
			'GI': 'Gibilterra',
			'DJ': 'Gibuti',
			'JO': 'Giordania',
			'GR': 'Grecia',
			'GD': 'Grenada',
			'GL': 'Groenlandia',
			'GP': 'Guadalupa',
			'GU': 'Guam',
			'GT': 'Guatemala',
			'GG': 'Guernsey',
			'GF': 'Guiana Francese',
			'GN': 'Guinea',
			'GQ': 'Guinea Equatoriale',
			'GW': 'Guinea-Bissau',
			'GY': 'Guyana',
			'HT': 'Haiti',
			'HN': 'Honduras',
			'IN': 'India',
			'ID': 'Indonesia',
			'IR': 'Iran',
			'IQ': 'Iraq',
			'IE': 'Irlanda',
			'IS': 'Islanda',
			'AC': 'Isola di Ascensione',
			'CX': 'Isola di Christmas',
			'IM': 'Isola di Man',
			'NF': 'Isola Norfolk',
			'AX': 'Isole Aland',
			'IC': 'Isole Canarie',
			'KY': 'Isole Cayman',
			'CC': 'Isole Cocos',
			'CK': 'Isole Cook',
			'FK': 'Isole Falkland',
			'FO': 'Isole Faroe',
			'MP': 'Isole Marianne Settentrionali',
			'MH': 'Isole Marshall',
			'UM': 'Isole minori lontane dagli USA',
			'PN': 'Isole Pitcairn',
			'SB': 'Isole Solomon',
			'TC': 'Isole Turks e Caicos',
			'VI': 'Isole Vergini Americane',
			'VG': 'Isole Vergini Britanniche',
			'IL': 'Israele',
			'IT': 'Italia',
			'JE': 'Jersey',
			'KZ': 'Kazakistan',
			'KE': 'Kenya',
			'KG': 'Kirghizistan',
			'KI': 'Kiribati',
			'XK': 'Kosovo',
			'KW': 'Kuwait',
			'LA': 'Laos',
			'LS': 'Lesotho',
			'LV': 'Lettonia',
			'LB': 'Libano',
			'LR': 'Liberia',
			'LY': 'Libia',
			'LI': 'Liechtenstein',
			'LT': 'Lituania',
			'LU': 'Lussemburgo',
			'MG': 'Madagascar',
			'MW': 'Malawi',
			'MV': 'Maldive',
			'MY': 'Malesia',
			'ML': 'Mali',
			'MT': 'Malta',
			'MA': 'Marocco',
			'MQ': 'Martinica',
			'MR': 'Mauritania',
			'MU': 'Mauritius',
			'YT': 'Mayotte',
			'MX': 'Messico',
			'FM': 'Micronesia',
			'MD': 'Moldavia',
			'MC': 'Monaco',
			'MN': 'Mongolia',
			'ME': 'Montenegro',
			'MS': 'Montserrat',
			'MZ': 'Mozambico',
			'MM': 'Myanmar (Birmania)',
			'NA': 'Namibia',
			'NR': 'Nauru',
			'NP': 'Nepal',
			'NI': 'Nicaragua',
			'NE': 'Niger',
			'NG': 'Nigeria',
			'NU': 'Niue',
			'NO': 'Norvegia',
			'NC': 'Nuova Caledonia',
			'NZ': 'Nuova Zelanda',
			'OM': 'Oman',
			'NL': 'Paesi Bassi',
			'PK': 'Pakistan',
			'PW': 'Palau',
			'PA': 'Panamá',
			'PG': 'Papua Nuova Guinea',
			'PY': 'Paraguay',
			'PE': 'Perù',
			'PF': 'Polinesia Francese',
			'PL': 'Polonia',
			'PT': 'Portogallo',
			'PR': 'Portorico',
			'QA': 'Qatar',
			'HK': 'RAS di Hong Kong',
			'MO': 'RAS di Macao',
			'GB': 'Regno Unito',
			'CZ': 'Repubblica Ceca',
			'CF': 'Repubblica Centrafricana',
			'MK': 'Repubblica di Macedonia',
			'DO': 'Repubblica Dominicana',
			'RE': 'Réunion',
			'RO': 'Romania',
			'RW': 'Ruanda',
			'EH': 'Sahara Occidentale',
			'KN': 'Saint Kitts e Nevis',
			'LC': 'Saint Lucia',
			'MF': 'Saint Martin',
			'PM': 'Saint Pierre e Miquelon',
			'VC': 'Saint Vincent e Grenadines',
			'BL': 'Saint-Barthélemy',
			'WS': 'Samoa',
			'AS': 'Samoa Americane',
			'SM': 'San Marino',
			'SH': 'Sant’Elena',
			'ST': 'São Tomé e Príncipe',
			'SN': 'Senegal',
			'RS': 'Serbia',
			'SC': 'Seychelles',
			'SL': 'Sierra Leone',
			'SG': 'Singapore',
			'SX': 'Sint Maarten',
			'SY': 'Siria',
			'SK': 'Slovacchia',
			'SI': 'Slovenia',
			'SO': 'Somalia',
			'ES': 'Spagna',
			'LK': 'Sri Lanka',
			'US': 'Stati Uniti',
			'ZA': 'Sudafrica',
			'SD': 'Sudan',
			'SS': 'Sudan del Sud',
			'SR': 'Suriname',
			'SJ': 'Svalbard e Jan Mayen',
			'SE': 'Svezia',
			'CH': 'Svizzera',
			'SZ': 'Swaziland',
			'TJ': 'Tagikistan',
			'TH': 'Tailandia',
			'TW': 'Taiwan',
			'TZ': 'Tanzania',
			'TF': 'Territori australi francesi',
			'PS': 'Territori palestinesi',
			'IO': 'Territorio Britannico dell’Oceano Indiano',
			'TL': 'Timor Est',
			'TG': 'Togo',
			'TK': 'Tokelau',
			'TO': 'Tonga',
			'TT': 'Trinidad e Tobago',
			'TA': 'Tristan da Cunha',
			'TN': 'Tunisia',
			'TR': 'Turchia',
			'TM': 'Turkmenistan',
			'TV': 'Tuvalu',
			'UA': 'Ucraina',
			'UG': 'Uganda',
			'HU': 'Ungheria',
			'UY': 'Uruguay',
			'UZ': 'Uzbekistan',
			'VU': 'Vanuatu',
			'VE': 'Venezuela',
			'VN': 'Vietnam',
			'WF': 'Wallis e Futuna',
			'YE': 'Yemen',
			'ZM': 'Zambia',
			'ZW': 'Zimbabwe'
		},
		'nl_NL': {
			'AF': 'Afghanistan',
			'AX': 'Åland',
			'AL': 'Albanië',
			'DZ': 'Algerije',
			'AS': 'Amerikaans-Samoa',
			'VI': 'Amerikaanse Maagdeneilanden',
			'AD': 'Andorra',
			'AO': 'Angola',
			'AI': 'Anguilla',
			'AQ': 'Antarctica',
			'AG': 'Antigua en Barbuda',
			'AR': 'Argentinië',
			'AM': 'Armenië',
			'AW': 'Aruba',
			'AC': 'Ascension',
			'AU': 'Australië',
			'AZ': 'Azerbeidzjan',
			'BS': 'Bahama’s',
			'BH': 'Bahrein',
			'BD': 'Bangladesh',
			'BB': 'Barbados',
			'BE': 'België',
			'BZ': 'Belize',
			'BJ': 'Benin',
			'BM': 'Bermuda',
			'BT': 'Bhutan',
			'BO': 'Bolivia',
			'BA': 'Bosnië en Herzegovina',
			'BW': 'Botswana',
			'BR': 'Brazilië',
			'IO': 'Britse Gebieden in de Indische Oceaan',
			'VG': 'Britse Maagdeneilanden',
			'BN': 'Brunei',
			'BG': 'Bulgarije',
			'BF': 'Burkina Faso',
			'BI': 'Burundi',
			'KH': 'Cambodja',
			'CA': 'Canada',
			'IC': 'Canarische Eilanden',
			'BQ': 'Caribisch Nederland',
			'KY': 'Caymaneilanden',
			'CF': 'Centraal-Afrikaanse Republiek',
			'EA': 'Ceuta en Melilla',
			'CL': 'Chili',
			'CN': 'China',
			'CX': 'Christmaseiland',
			'CC': 'Cocoseilanden',
			'CO': 'Colombia',
			'KM': 'Comoren',
			'CG': 'Congo-Brazzaville',
			'CD': 'Congo-Kinshasa',
			'CK': 'Cookeilanden',
			'CR': 'Costa Rica',
			'CU': 'Cuba',
			'CW': 'Curaçao',
			'CY': 'Cyprus',
			'DK': 'Denemarken',
			'DG': 'Diego Garcia',
			'DJ': 'Djibouti',
			'DM': 'Dominica',
			'DO': 'Dominicaanse Republiek',
			'DE': 'Duitsland',
			'EC': 'Ecuador',
			'EG': 'Egypte',
			'SV': 'El Salvador',
			'GQ': 'Equatoriaal-Guinea',
			'ER': 'Eritrea',
			'EE': 'Estland',
			'ET': 'Ethiopië',
			'FO': 'Faeröer',
			'FK': 'Falklandeilanden',
			'FJ': 'Fiji',
			'PH': 'Filipijnen',
			'FI': 'Finland',
			'FR': 'Frankrijk',
			'GF': 'Frans-Guyana',
			'PF': 'Frans-Polynesië',
			'TF': 'Franse Gebieden in de zuidelijke Indische Oceaan',
			'GA': 'Gabon',
			'GM': 'Gambia',
			'GE': 'Georgië',
			'GH': 'Ghana',
			'GI': 'Gibraltar',
			'GD': 'Grenada',
			'GR': 'Griekenland',
			'GL': 'Groenland',
			'GP': 'Guadeloupe',
			'GU': 'Guam',
			'GT': 'Guatemala',
			'GG': 'Guernsey',
			'GN': 'Guinee',
			'GW': 'Guinee-Bissau',
			'GY': 'Guyana',
			'HT': 'Haïti',
			'HN': 'Honduras',
			'HU': 'Hongarije',
			'HK': 'Hongkong SAR van China',
			'IE': 'Ierland',
			'IS': 'IJsland',
			'IN': 'India',
			'ID': 'Indonesië',
			'IQ': 'Irak',
			'IR': 'Iran',
			'IM': 'Isle of Man',
			'IL': 'Israël',
			'IT': 'Italië',
			'CI': 'Ivoorkust',
			'JM': 'Jamaica',
			'JP': 'Japan',
			'YE': 'Jemen',
			'JE': 'Jersey',
			'JO': 'Jordanië',
			'CV': 'Kaapverdië',
			'CM': 'Kameroen',
			'KZ': 'Kazachstan',
			'KE': 'Kenia',
			'KG': 'Kirgizië',
			'KI': 'Kiribati',
			'UM': 'Kleine afgelegen eilanden van de Verenigde Staten',
			'KW': 'Koeweit',
			'XK': 'Kosovo',
			'HR': 'Kroatië',
			'LA': 'Laos',
			'LS': 'Lesotho',
			'LV': 'Letland',
			'LB': 'Libanon',
			'LR': 'Liberia',
			'LY': 'Libië',
			'LI': 'Liechtenstein',
			'LT': 'Litouwen',
			'LU': 'Luxemburg',
			'MO': 'Macau SAR van China',
			'MK': 'Macedonië',
			'MG': 'Madagaskar',
			'MW': 'Malawi',
			'MV': 'Maldiven',
			'MY': 'Maleisië',
			'ML': 'Mali',
			'MT': 'Malta',
			'MA': 'Marokko',
			'MH': 'Marshalleilanden',
			'MQ': 'Martinique',
			'MR': 'Mauritanië',
			'MU': 'Mauritius',
			'YT': 'Mayotte',
			'MX': 'Mexico',
			'FM': 'Micronesia',
			'MD': 'Moldavië',
			'MC': 'Monaco',
			'MN': 'Mongolië',
			'ME': 'Montenegro',
			'MS': 'Montserrat',
			'MZ': 'Mozambique',
			'MM': 'Myanmar (Birma)',
			'NA': 'Namibië',
			'NR': 'Nauru',
			'NL': 'Nederland',
			'NP': 'Nepal',
			'NI': 'Nicaragua',
			'NC': 'Nieuw-Caledonië',
			'NZ': 'Nieuw-Zeeland',
			'NE': 'Niger',
			'NG': 'Nigeria',
			'NU': 'Niue',
			'KP': 'Noord-Korea',
			'MP': 'Noordelijke Marianen',
			'NO': 'Noorwegen',
			'NF': 'Norfolk',
			'UG': 'Oeganda',
			'UA': 'Oekraïne',
			'UZ': 'Oezbekistan',
			'OM': 'Oman',
			'TL': 'Oost-Timor',
			'AT': 'Oostenrijk',
			'PK': 'Pakistan',
			'PW': 'Palau',
			'PS': 'Palestijnse gebieden',
			'PA': 'Panama',
			'PG': 'Papoea-Nieuw-Guinea',
			'PY': 'Paraguay',
			'PE': 'Peru',
			'PN': 'Pitcairneilanden',
			'PL': 'Polen',
			'PT': 'Portugal',
			'PR': 'Puerto Rico',
			'QA': 'Qatar',
			'RE': 'Réunion',
			'RO': 'Roemenië',
			'RU': 'Rusland',
			'RW': 'Rwanda',
			'KN': 'Saint Kitts en Nevis',
			'LC': 'Saint Lucia',
			'VC': 'Saint Vincent en de Grenadines',
			'BL': 'Saint-Barthélemy',
			'MF': 'Saint-Martin',
			'PM': 'Saint-Pierre en Miquelon',
			'SB': 'Salomonseilanden',
			'WS': 'Samoa',
			'SM': 'San Marino',
			'ST': 'Sao Tomé en Principe',
			'SA': 'Saoedi-Arabië',
			'SN': 'Senegal',
			'RS': 'Servië',
			'SC': 'Seychellen',
			'SL': 'Sierra Leone',
			'SG': 'Singapore',
			'SH': 'Sint-Helena',
			'SX': 'Sint-Maarten',
			'SI': 'Slovenië',
			'SK': 'Slowakije',
			'SD': 'Soedan',
			'SO': 'Somalië',
			'ES': 'Spanje',
			'SJ': 'Spitsbergen en Jan Mayen',
			'LK': 'Sri Lanka',
			'SR': 'Suriname',
			'SZ': 'Swaziland',
			'SY': 'Syrië',
			'TJ': 'Tadzjikistan',
			'TW': 'Taiwan',
			'TZ': 'Tanzania',
			'TH': 'Thailand',
			'TG': 'Togo',
			'TK': 'Tokelau',
			'TO': 'Tonga',
			'TT': 'Trinidad en Tobago',
			'TA': 'Tristan da Cunha',
			'TD': 'Tsjaad',
			'CZ': 'Tsjechië',
			'TN': 'Tunesië',
			'TR': 'Turkije',
			'TM': 'Turkmenistan',
			'TC': 'Turks- en Caicoseilanden',
			'TV': 'Tuvalu',
			'UY': 'Uruguay',
			'VU': 'Vanuatu',
			'VA': 'Vaticaanstad',
			'VE': 'Venezuela',
			'GB': 'Verenigd Koninkrijk',
			'AE': 'Verenigde Arabische Emiraten',
			'US': 'Verenigde Staten',
			'VN': 'Vietnam',
			'WF': 'Wallis en Futuna',
			'EH': 'Westelijke Sahara',
			'BY': 'Wit-Rusland',
			'ZM': 'Zambia',
			'ZW': 'Zimbabwe',
			'ZA': 'Zuid-Afrika',
			'GS': 'Zuid-Georgia en Zuidelijke Sandwicheilanden',
			'KR': 'Zuid-Korea',
			'SS': 'Zuid-Soedan',
			'SE': 'Zweden',
			'CH': 'Zwitserland'
		}
	})

	/**
	 * @class CountryUtils
	 * @propertyOf keta.utils.Country
	 * @description Country Utils Factory
	 */
	.factory('ketaCountryUtils', function CountryUtils(ketaCountryUtilsMessageKeys) {

		var factory = {};

		/**
		 * @name getCountryList
		 * @function
		 * @description
		 * <p>
		 *     Returns the country list for a given locale in the form of
		 *     {key: 'DE', 'value': 'Germany'}.
		 * </p>
		 * <p>
		 *     Locales only match from specific > general > fallback
		 *     e.g. 'de_AT' > 'de' > 'en'.
		 * </p>
		 * <p>
		 *     Accessor provides the possibility to reformat the return value on per usage basis.
		 *     The accessor is optional.
		 * </p>
		 * @param {string} currentLocale can be either in short ('en') or long ('en_US') format.
		 * @param {function} accessor a function to format the output
		 * @returns {Array} all countries
		 * @example
		 * angular.module('exampleApp', ['keta.utils.Country'])
		 *     .controller('ExampleController', function($scope, ketaCountryUtils) {
		 *
		 *         $scope.currentLocale = 'en_GB';
		 *
		 *         // countries as array of objects {key: ..., value: ...}
		 *         $scope.countries = ketaCountryUtils.getCountryList($scope.currentLocale);
		 *
		 *     });
		 * @example
		 * angular.module('exampleApp', ['keta.utils.Country'])
		 *     .controller('ExampleController', function($scope, ketaCountryUtils) {
		 *
		 *         $scope.currentLocale = 'en_GB';
		 *
		 *         // countries as array of objects {value: ..., name: ...}
		 *         $scope.countries =
		 *             ketaCountryUtils.getCountryList($scope.currentLocale, function(countryName, countryCode) {
		 *                 return {value: countryCode, name: countryName};
		 *             });
		 *
		 *     });
		 */
		factory.getCountryList = function getCountryList(currentLocale, accessor) {
			var countries = [];

			var LOCALE_LENGTH = 5;

			var shortLocale =
				angular.isString(currentLocale) &&
				currentLocale.length >= LOCALE_LENGTH ?
					currentLocale.substr(0, LOCALE_LENGTH) : '';

			if (!angular.isObject(ketaCountryUtilsMessageKeys[currentLocale])) {
				currentLocale = angular.isObject(ketaCountryUtilsMessageKeys[shortLocale]) ? shortLocale : 'en_GB';
			}

			angular.forEach(ketaCountryUtilsMessageKeys[currentLocale], function(countryName, countryIsoCode) {
				countries.push(
					angular.isFunction(accessor) ?
						accessor(countryName, countryIsoCode) : {key: countryIsoCode, value: countryName});
			});

			return countries;
		};

		return factory;
	});
