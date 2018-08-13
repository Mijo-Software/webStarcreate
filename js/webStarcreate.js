const
  RAND_MAX = 2147483647.0,
  PI = 2 * Math.PI,
  RADIANS_PER_ROTATION = 2 * PI,
  ECCENTRICITY_COEFF = 0.077,          /* Dole's was 0.077 */
  PROTOPLANET_MASS = 1.0E-15,          /* Units of solar masses */
  CHANGE_IN_EARTH_ANG_VEL = -1.3E-15,  /* Units of radians/sec/year*/
  SOLAR_MASS_IN_GRAMS = 1.989E33,      /* Units of grams */
  SOLAR_MASS_IN_KILOGRAMS = 1.989E30,  /* Units of kg */
  EARTH_MASS_INGRAMS = 5.977E27,       /* Units of grams */
  EARTH_RADIUS = 6.378E8,              /* Units of cm */
  EARTH_DENSITY = 5.52,                /* Units of g/cc */
  KM_EARTH_RADIUS = 6378.0,            /* Units of km */
  EARTH_ACCELERATION = 980.7,          /* Units of cm/sec2 */
  EARTH_AXIAL_TILT = 23.4,             /* Units of degrees */
  EARTH_EXOSPHERE_TEMP = 1273.0,       /* Units of degrees Kelvin */
  SUN_MASS_IN_EARTH_MASSES = 332775.64,
  ASTEROID_MASS_LIMIT = 0.001,         /* Units of Earth Masses */
  EARTH_EFFECTIVE_TEMP = 250.0,        /* Units of degrees Kelvin (was 255) */
  CLOUD_COVERAGE_FACTOR = 1.839E-8,    /* Km2/kg */
  EARTH_WATER_MASS_PER_AREA = 3.83E15, /* grams per square km */
  EARTH_SURF_PRES_IN_MILLIBARS = 1013.25,
  EARTH_SURF_PRES_IN_MMHG = 760,       /* Dole p. 15 */
  EARTH_SURF_PRES_IN_PSI = 14.696,     /* Pounds per square inch */
  MMHG_TO_MILLIBARS = EARTH_SURF_PRES_IN_MILLIBARS / EARTH_SURF_PRES_IN_MMHG,
  PSI_TO_MILLIBARS = EARTH_SURF_PRES_IN_MILLIBARS / EARTH_SURF_PRES_IN_PSI,
  H20_ASSUMED_PRESSURE = 47 * MMHG_TO_MILLIBARS,   /* Dole p. 15 */
  MIN_O2_IPP = 72 * MMHG_TO_MILLIBARS,             /* Dole, p. 15 */
  MAX_O2_IPP = 400 * MMHG_TO_MILLIBARS,            /* Dole, p. 15 */
  MAX_HE_IPP = 61000 * MMHG_TO_MILLIBARS,          /* Dole, p. 16 */
  MAX_NE_IPP = 3900 * MMHG_TO_MILLIBARS,           /* Dole, p. 16 */
  MAX_N2_IPP = 2330 * MMHG_TO_MILLIBARS,           /* Dole, p. 16 */
  MAX_AR_IPP = 1220 * MMHG_TO_MILLIBARS,           /* Dole, p. 16 */
  MAX_KR_IPP = 350 * MMHG_TO_MILLIBARS,            /* Dole, p. 16 */
  MAX_XE_IPP = 160 * MMHG_TO_MILLIBARS,            /* Dole, p. 16 */
  MAX_CO2_IPP = 7 * MMHG_TO_MILLIBARS,             /* Dole, p. 16 */
  MAX_HABITABLE_PRESSURE = 118 * PSI_TO_MILLIBARS, /* Dole, p. 16 */
  // The next gases are listed as poisonous in parts per million by volume at 1 atm:
  PPM_PRSSURE = EARTH_SURF_PRES_IN_MILLIBARS / 1000000,
  MAX_F_IPP = 0.1 * PPM_PRSSURE,     /* Dole, p. 18 */
  MAX_CL_IPP = 1.0 * PPM_PRSSURE,    /* Dole, p. 18 */
  MAX_NH3_IPP = 100 * PPM_PRSSURE,   /* Dole, p. 18 */
  MAX_O3_IPP = 0.1 * PPM_PRSSURE,    /* Dole, p. 18 */
  MAX_CH4_IPP = 50000 * PPM_PRSSURE, /* Dole, p. 18 */
  EARTH_CONVECTION_FACTOR = 0.43,    /* from Hart, eq.20 */
  FREEZING_POINT_OF_WATER = 273.15,  /* Units of degrees Kelvin */
  EARTH_AVERAGE_CELSIUS = 14.0,      /* Average Earth Temperature */
  EARTH_AVERAGE_KELVIN = EARTH_AVERAGE_CELSIUS + FREEZING_POINT_OF_WATER,
  DAYS_IN_A_YEAR = 365.256,      /* Earth days per Earth year*/
  GAS_RETENTION_THRESHOLD = 6.0, /* ratio of esc vel to RMS vel */
  ICE_ALBEDO = 0.7,
  CLOUD_ALBEDO = 0.52,
  GAS_GIANT_ALBEDO = 0.5,        /* albedo of a gas giant */
  AIRLESS_ICE_ALBEDO = 0.5,
  EARTH_ALBEDO = 0.3,            /* was .33 for a while */
  GREENHOUSE_TRIGGER_ALBEDO = 0.20,
  ROCKY_ALBEDO = 0.15,
  ROCKY_AIRLESS_ALBEDO = 0.07,
  WATER_ALBEDO = 0.04,
  SECONDS_PER_HOUR = 3600.0,
  CM_PER_AU = 1.495978707E13, /* number of cm in an AU */
  CM_PER_KM = 1.0E5,          /* number of cm in a km */
  KM_PER_AU = CM_PER_AU / CM_PER_KM,
  CM_PER_METER = 100.0,
  MILLIBARS_PER_BAR = 1000.00,
  GRAV_CONSTANT = 6.672E-8,  /* units of dyne cm2/gram2 */
  MOLAR_GAS_CONST = 8314.41, /* units: g*m2/(sec2*K*mol) */
  K = 50.0,                    /* K = gas/dust ratio */
  B = 1.2E-5,                  /* Used in Crit_mass calc */
  DUST_DENSITY_COEFF = 2.0E-3, /* A in Dole's paper */
  ALPHA = 5.0,                 /* Used in density calcs */
  N = 3.0,                     /* Used in density calcs */
  J = 1.46E-19,                /* Used in day-length calcs (cm2/sec2 g) */
  INCREDIBLY_LARGE_NUMBER = 9.9999E37,
  /* Now for a few molecular weights (used for RMS velocity calcs): */
  /* This table is from Dole's book "Habitable Planets for Man", p. 38 */
  ATOMIC_HYDROGEN   = 1.0,   /* H */
  MOL_HYDROGEN      = 2.0,   /* H2 */
  HELIUM            = 4.0,   /* He */
  ATOMIC_NITROGEN   = 14.0,  /* N */
  ATOMIC_OXYGEN     = 16.0,  /* O */
  METHANE           = 16.0,  /* CH4 */
  AMMONIA           = 17.0,  /* NH3 */
  WATER_VAPOR       = 18.0,  /* H2O */
  NEON              = 20.2,  /* Ne */
  MOL_NITROGEN      = 28.0,  /* N2 */
  CARBON_MONOXIDE   = 28.0,  /* CO */
  NITRIC_OXIDE      = 30.0,  /* NO */
  MOL_OXYGEN        = 32.0,  /* O2 */
  HYDROGEN_SULPHIDE = 34.1,  /* H2S */
  ARGON             = 39.9,  /* Ar */
  CARBON_DIOXIDE    = 44.0,  /* CO2 */
  NITROUS_OXIDE     = 44.0,  /* N2O */
  NITROGEN_DIOXIDE  = 46.0,  /* NO2 */
  OZONE             = 48.0,  /* O3 */
  SULPH_DIOXIDE     = 64.1,  /* SO2 */
  SULPH_TRIOXIDE    = 80.1,  /* SO3 */
  KRYPTON           = 83.8,  /* Kr */
  XENON             = 131.3, /* Xe */
  // And atomic numbers, for use in ChemTable indexes
  AN_H =          1,
  AN_HE =         2,
  AN_N =          7,
  AN_O =          8,
  AN_F =          9,
  AN_NE =        10,
  AN_P =         15,
  AN_CL =        17,
  AN_AR =        18,
  AN_BR =        35,
  AN_KR =        36,
  AN_I =         53,
  AN_XE =        54,
  AN_HG =        80,
  AN_AT =        85,
  AN_RN =        86,
  AN_FR =        87,
  AN_NH3 =      900,
  AN_H2O =      901,
  AN_CO2 =      902,
  AN_O3 =       903,
  AN_CH4 =      904,
  AN_CH3CH2OH = 905,
  /* The following defines are used in the kothari_radius function in */
  /* file enviro.c. */
  A1_20 = 6.485E12,  /* All units are in cgs system. */
  A2_20 = 4.0032E-8, /* ie: cm, g, dynes, etc. */
  BETA_20 = 5.71E12,
  JIMS_FUDGE = 1.004,
  /* The following defines are used in determining the fraction of a planet */
  /* covered with clouds in function cloud_fraction in file enviro.c. */
  Q1_36 = 1.258E19, /* grams */
  Q2_36 = 0.0698;   /* 1/Kelvin */

function pow2(a) {
  return MATH.pow(a, 2);
}
  
function pow3(a) {
  return MATH.pow(a, 3);
}
  
function pow4(a) {
  return MATH.pow(a, 4);
}
  
function pow1_4(a) {
  return MATH.pow(a, 0.25);
}
  
function pow1_3(a) {
  return MATH.pow(a, (1.0/3.0));
}

/*----------------------------------------------------------------------*/
/*	This function returns a random real number between the specified    */
/*  inner and outer bounds.			  					                      	    */
/*----------------------------------------------------------------------*/

function random_number(inner, outer)
{
	var range;
	range = outer - inner;
	return (Math.floor(Math.random() * RAND_MAX) / RAND_MAX) * range + inner;
}

/*----------------------------------------------------------------------*/
/*	 This function returns a value within a certain variation of the	  */
/*	 exact value given it in 'value'.									                  */
/*----------------------------------------------------------------------*/

function about(value, variation)
{
	return value + (value * random_number(-variation,variation));
}

function random_eccentricity()
{
	var	e;
	e = 1.0 - MATH.pow(Math.random(), ECCENTRICITY_COEFF);
	if (e > 0.99)	e = 0.99;
	return e;
}

