"use strict";

const
  RAND_MAX = 2147483647.0,
  PI = 2 * Math.PI,
  RADIANS_PER_ROTATION = 2 * PI,
  ECCENTRICITY_COEFF = 0.077,          /* Dole's was 0.077 */
  PROTOPLANET_MASS = 1.0E-15,          /* Units of solar masses */
  CHANGE_IN_EARTH_ANG_VEL = -1.3E-15,  /* Units of radians/sec/year*/
  SOLAR_MASS_IN_GRAMS = 1.989E33,      /* Units of grams */
  SOLAR_MASS_IN_KILOGRAMS = 1.989E30,  /* Units of kg */
  EARTH_MASS_IN_GRAMS = 5.977E27,      /* Units of grams */
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
  H20_ASSUMED_PRESSURE = 47 * MMHG_TO_MILLIBARS,   /* Dole, p. 15 */
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
  
let breathability_phrase = ["none", "breathable", "unbreathable", "poisonous"];

function pow2(a) {
  return Math.pow(a, 2);
}
  
function pow3(a) {
  return Math.pow(a, 3);
}
  
function pow4(a) {
  return Math.pow(a, 4);
}
  
function pow1_4(a) {
  return Math.pow(a, 0.25);
}
  
function pow1_3(a) {
  return Math.pow(a, (1.0/3.0));
}

/*----------------------------------------------------------------------*/
/*  This function returns a random real number between the specified    */
/*  inner and outer bounds.                                             */
/*----------------------------------------------------------------------*/

function random_number(inner, outer)
{
  let range;
  range = outer - inner;
  return (Math.floor(Math.random() * RAND_MAX) / RAND_MAX) * range + inner;
}

/*----------------------------------------------------------------------*/
/*   This function returns a value within a certain variation of the    */
/*   exact value given it in 'value'.                                   */
/*----------------------------------------------------------------------*/

function about(value, variation)
{
  return value + (value * random_number(-variation,variation));
}

function random_eccentricity()
{
  let e;
  e = 1.0 - Math.pow(Math.random(), ECCENTRICITY_COEFF);
  if (e > 0.999999999999) e = 0.999999999999;
  return e;
}

function chaotic_random_eccentricity()
{
  return Math.random();
}

/*--------------------------------------------------------------------------*/
/*   This function, given the mass ratio of a star in AU, returns           */
/*   the luminosity of the star.                                            */
/*--------------------------------------------------------------------------*/

function luminosity(mass_ratio)
{
  let n;
  if (mass_ratio < 1.0)
    n = 1.75 * (mass_ratio - 0.1) + 3.325;
  else
    n = 0.5 * (2.0 - mass_ratio) + 4.4;
  return Math.pow(mass_ratio,n);
}

/*--------------------------------------------------------------------------*/
/*   This function, given the orbital radius of a planet in AU, returns     */
/*   the orbital 'zone' of the particle.                                    */
/*--------------------------------------------------------------------------*/

function orb_zone(luminosity, orb_radius)
{
  if (orb_radius < (4.0 * Math.sqrt(luminosity)))
    return 1;
  else if (orb_radius < (15.0 * Math.sqrt(luminosity)))
    return 2;
  else
    return 3;
}

/*--------------------------------------------------------------------------*/
/*   The mass is in units of solar masses, and the density is in units      */
/*   of grams/cc.  The radius returned is in units of km.                   */
/*--------------------------------------------------------------------------*/

function volume_radius(mass, density)
{
  let volume;
  mass = mass * SOLAR_MASS_IN_GRAMS;
  volume = mass / density;
  return Math.pow((3.0 * volume) / (4.0 * PI), (1.0 / 3.0)) / CM_PER_KM;
}

/*--------------------------------------------------------------------------*/
/*   Returns the radius of the planet in kilometers.                        */
/*   The mass passed in is in units of solar masses.                        */
/*   This formula is listed as eq.9 in Fogg's article, although some typos  */
/*   crop up in that eq.  See "The Internal Constitution of Planets", by    */
/*   Dr. D. S. Kothari, Mon. Not. of the Royal Astronomical Society, vol 96 */
/*   pp.833-843, 1936 for the derivation.  Specifically, this is Kothari's  */
/*   eq.23, which appears on page 840.                                      */
/*--------------------------------------------------------------------------*/

function kothari_radius(mass, giant, zone)
{
  let temp1, temp, temp2, atomic_weight, atomic_num;
  
  if (zone == 1) {
    if (giant) {
      atomic_weight = 9.5;
      atomic_num = 4.5;
    } else {
      atomic_weight = 15.0;
      atomic_num = 8.0;
    }
  } else if (zone == 2) {
    if (giant) {
      atomic_weight = 2.47;
      atomic_num = 2.0;
    } else {
      atomic_weight = 10.0;
      atomic_num = 5.0;
    }
  } else {
    if (giant) {
      atomic_weight = 7.0;
      atomic_num = 4.0;
    } else {
      atomic_weight = 10.0;
      atomic_num = 5.0;
    }
  }
  
  temp1 = atomic_weight * atomic_num;
  temp = (2.0 * BETA_20 * Math.pow(SOLAR_MASS_IN_GRAMS, (1.0 / 3.0))) / (A1_20 * Math.pow(temp1, (1.0 / 3.0)));
  temp2 = A2_20 * Math.pow(atomic_weight, (4.0 / 3.0)) * Math.pow(SOLAR_MASS_IN_GRAMS, (2.0 / 3.0));
  temp2 = temp2 * Math.pow(mass, (2.0 / 3.0));
  temp2 = temp2 / (A1_20 * pow2(atomic_num));
  temp2 = 1.0 + temp2;
  temp = temp / temp2;
  temp = (temp * Math.pow(mass, (1.0 / 3.0))) / CM_PER_KM;
  temp /= JIMS_FUDGE; /* Make Earth = actual earth */
  
  return temp;
}

/*--------------------------------------------------------------------------*/
/*  The mass passed in is in units of solar masses, and the orbital radius  */
/*  is in units of AU. The density is returned in units of grams/cc.        */
/*--------------------------------------------------------------------------*/

function empirical_density(mass, orb_radius, r_ecosphere, gas_giant)
{
  let temp;
  
  temp = Math.pow(mass * SUN_MASS_IN_EARTH_MASSES, (1.0 / 8.0));
  temp = temp * pow1_4(r_ecosphere / orb_radius);
  if (gas_giant)
    return(temp * 1.2);
  else
    return(temp * 5.5);
}

/*--------------------------------------------------------------------------*/
/*  The mass passed in is in units of solar masses, and the equatorial      */
/*  radius is in km. The density is returned in units of grams/cc.          */
/*--------------------------------------------------------------------------*/

function volume_density(mass, equat_radius)
{
  let volume;
  
  mass = mass * SOLAR_MASS_IN_GRAMS;
  equat_radius = equat_radius * CM_PER_KM;
  volume = (4.0 * PI * pow3(equat_radius)) / 3.0;
  return (mass / volume);
}


/*--------------------------------------------------------------------------*/
/*  The separation is in units of AU, and both masses are in units of solar */
/*  masses.  The period returned is in terms of Earth days.                 */
/*--------------------------------------------------------------------------*/

function period(separation, small_mass, large_mass)
{
  let period_in_years;
  
  period_in_years = Math.sqrt(pow3(separation) / (small_mass + large_mass));
  return period_in_years * DAYS_IN_A_YEAR;
}

/*--------------------------------------------------------------------------*/
/*   Fogg's information for this routine came from Dole "Habitable Planets  */
/* for Man", Blaisdell Publishing Company, NY, 1964.  From this, he came    */
/* up with his eq.12, which is the equation for the 'base_angular_velocity' */
/* below.  He then used an equation for the change in angular velocity per  */
/* time (dw/dt) from P. Goldreich and S. Soter's paper "Q in the Solar      */
/* System" in Icarus, vol 5, pp.375-389 (1966).   Using as a comparison the */
/* change in angular velocity for the Earth, Fogg has come up with an       */
/* approximation for our new planet (his eq.13) and take that into account. */
/* This is used to find 'change_in_angular_velocity' below.                 */
/*                                                                          */
/*   Input parameters are mass (in solar masses), radius (in Km), orbital   */
/* period (in days), orbital radius (in AU), density (in g/cc),             */
/* eccentricity, and whether it is a gas giant or not.                      */
/*   The length of the day is returned in units of hours.                   */
/*--------------------------------------------------------------------------*/

let planet_pointer = {
    a: 0, /* semi-major axis of the orbit (in AU)*/
    e: 0, /* eccentricity of the orbit */
    mass: 0, /* mass (in solar masses) */
    gasGiant: 0, /* TRUE if the planet is a gas giant */
    orbit_zone: 0, /* the 'zone' of the planet */
    radius: 0, /* equatorial radius (in km) */
    density: 0, /* density (in g/cc) */
    orbital_period: 0, /* length of the local year (days) */
    day: 0, /* length of the local day (hours) */
    resonant_period: 0, /* TRUE if in resonant rotation */
    axial_tilt: 0, /* units of degrees */
    escape_velocity: 0, /* units of cm/sec */
    surface_accel: 0, /* units of cm/sec2 */
    surface_grav: 0, /* units of Earth gravities */
    rms_velocity: 0, /* units of cm/sec */
    molecule_weight: 0, /* smallest molecular weight retained */
    volatile_gas_inventory: 0,
    surface_pressure: 0, /* units of millibars (mb) */
    greenhouse_effect: 0, /* runaway greenhouse effect? */
    boil_point: 0, /* the boiling point of water (Kelvin)*/
    albedo: 0, /* albedo of the planet */
    surface_temp: 0, /* surface temperature in Kelvin */
    hydrosphere: 0, /* fraction of surface covered */
    cloud_cover: 0, /* fraction of surface covered */
    ice_cover: 0, /* fraction of surface covered */
    first_moon: null,
    next_planet: null
  };

function day_length(planet)
{
  let planetary_mass_in_grams = planet.mass * SOLAR_MASS_IN_GRAMS;
  let  equatorial_radius_in_cm = planet.radius * CM_PER_KM;
  let  year_in_hours  = planet.orb_period * 24.0;
  let giant = (planet.type == tGasGiant ||
         planet.type == tSubGasGiant ||
         planet.type == tSubSubGasGiant);
  let  k2;
  let  base_angular_velocity;
  let  change_in_angular_velocity;
  let  ang_velocity;
  let  spin_resonance_factor;
  let  day_in_hours;

  let stopped = false;

  planet.resonant_period = false;  /* Warning: Modify the planet */

  if (giant)
    k2 = 0.24;
  else
    k2 = 0.33;

  base_angular_velocity = Math.sqrt(2.0 * J * (planetary_mass_in_grams) / (k2 * pow2(equatorial_radius_in_cm)));

 /*  This next calculation determines how much the planet's rotation is   */
 /*  slowed by the presence of the star.                                  */

  change_in_angular_velocity = CHANGE_IN_EARTH_ANG_VEL * (planet.density / EARTH_DENSITY) * (equatorial_radius_in_cm / EARTH_RADIUS) * (EARTH_MASS_IN_GRAMS / planetary_mass_in_grams) * Math.pow(planet.primary.mass, 2.0) * (1.0 / Math.pow(planet.a, 6.0));
  ang_velocity = base_angular_velocity + (change_in_angular_velocity * planet.primary.age);

  /* Now we change from rad/sec to hours/rotation. */

  if (ang_velocity <= 0.0)
  {
     stopped = false;
     day_in_hours = INCREDIBLY_LARGE_NUMBER;
  }
  else
    day_in_hours = RADIANS_PER_ROTATION / (SECONDS_PER_HOUR * ang_velocity);

  if ((day_in_hours >= year_in_hours) || stopped)
  {
    if (planet.e > 0.1)
    {
      spin_resonance_factor   = (1.0 - planet.e) / (1.0 + planet.e);
      planet.resonant_period   = false;
      return spin_resonance_factor * year_in_hours;
    }
    else return year_in_hours;
  }
  return day_in_hours;
}

/*--------------------------------------------------------------------------*/
/*   The orbital radius is expected in units of Astronomical Units (AU).    */
/*   Inclination is returned in units of degrees.                           */
/*--------------------------------------------------------------------------*/

function inclination(orb_radius)
{
  let temp = Math.trunc(Math.pow(orb_radius, 0.2) * about(EARTH_AXIAL_TILT, 0.4));
  return temp % 360;
}

function inclination_with_fraction(orb_radius)
{
  let temp, fraction;
  temp = Math.pow(orb_radius, 0.2) * about(EARTH_AXIAL_TILT, 0.4);
  fraction = temp - Math.trunc(temp);
  temp = Math.trunc(temp);
  temp = (temp % 360) + fraction;
  return temp;
}

/*--------------------------------------------------------------------------*/
/*   This function implements the escape velocity calculation. Note that    */
/*  it appears that Fogg's eq.15 is incorrect.                              */
/*  The mass is in units of solar mass, the radius in kilometers, and the   */
/*  velocity returned is in cm/sec.                                         */
/*--------------------------------------------------------------------------*/

function escape_vel(mass, radius)
{
  let
    mass_in_grams = mass * SOLAR_MASS_IN_GRAMS,
    radius_in_cm = radius * CM_PER_KM;
  return Math.sqrt(2.0 * GRAV_CONSTANT * mass_in_grams / radius_in_cm);
}

/*--------------------------------------------------------------------------*/
/*  This is Fogg's eq.16.  The molecular weight (usually assumed to be N2)  */
/*  is used as the basis of the Root Mean Square (RMS) velocity of the      */
/*  molecule or atom.  The velocity returned is in cm/sec.                  */
/*  Orbital radius is in A.U.(ie: in units of the earth's orbital radius).  */
/*--------------------------------------------------------------------------*/

function rms_vel(molecular_weight, exospheric_temp)
{
  return Math.sqrt((3.0 * MOLAR_GAS_CONST * exospheric_temp) / molecular_weight) * CM_PER_METER;
}

/*--------------------------------------------------------------------------*/
/*   This function returns the smallest molecular weight retained by the    */
/*  body, which is useful for determining the atmosphere composition.       */
/*  Mass is in units of solar masses, and equatorial radius is in units of  */
/*  kilometers.                                                             */
/*--------------------------------------------------------------------------*/

function molecule_limit(mass, equat_radius, exospheric_temp)
{
  let esc_velocity = escape_vel(mass, equat_radius);
  
  return (3.0 * MOLAR_GAS_CONST * exospheric_temp) / (pow2((esc_velocity/ GAS_RETENTION_THRESHOLD) / CM_PER_METER));
}

/*--------------------------------------------------------------------------*/
/*   This function calculates the surface acceleration of a planet.   The   */
/*  mass is in units of solar masses, the radius in terms of km, and the    */
/*  acceleration is returned in units of cm/sec2.                           */
/*--------------------------------------------------------------------------*/

function acceleration(mass, radius)
{
  return GRAV_CONSTANT * (mass * SOLAR_MASS_IN_GRAMS) / pow2(radius * CM_PER_KM);
}

/*--------------------------------------------------------------------------*/
/*   This function calculates the surface gravity of a planet.  The         */
/*  acceleration is in units of cm/sec2, and the gravity is returned in     */
/*  units of Earth gravities.                                               */
/*--------------------------------------------------------------------------*/

function gravity(acceleration)
{
  return acceleration / EARTH_ACCELERATION;
}

/*--------------------------------------------------------------------------*/
/*  This implements Fogg's eq.17.  The 'inventory' returned is unitless.    */
/*--------------------------------------------------------------------------*/

function vol_inventory(mass, escape_vel, rms_vel, stellar_mass, zone, greenhouse_effect, accreted_gas)
{
  let velocity_ratio, proportion_const, temp1, temp2, earth_units;
  
  velocity_ratio = escape_vel / rms_vel;
  if (velocity_ratio >= GAS_RETENTION_THRESHOLD) {
    switch (zone) {
      case 1:
        proportion_const = 140000.0;  /* 100 . 140 JLB */
        break;
      case 2:
        proportion_const = 75000.0;
        break;
      case 3:
        proportion_const = 250.0;
        break;
      default:
        proportion_const = 0.0;
        console.log("Error: orbital zone not initialized correctly!");
        return "Error: orbital zone not initialized correctly!";
    }
    earth_units = mass * SUN_MASS_IN_EARTH_MASSES;
    temp1 = (proportion_const * earth_units) / stellar_mass;
    temp2 = about(temp1, 0.2);
    temp2 = temp1;
    if (greenhouse_effect || accreted_gas)
      return temp2;
    else
      return temp2 / 140.0;  /* 100 . 140 JLB */
  }
  else
    return 0;
}

/*---------------------------------------------------------------------------*/
/*  This implements Fogg's eq.18.  The pressure returned is in units of      */
/*  millibars (mb).   The gravity is in units of Earth gravities, the radius */
/*  in units of kilometers.                                                  */
/*                                                                           */
/*  JLB: Aparently this assumed that earth pressure = 1000mb. I've added a   */
/*  fudge factor (EARTH_SURF_PRES_IN_MILLIBARS / 1000.) to correct for that  */
/*---------------------------------------------------------------------------*/

function pressure(volatile_gas_inventory, equat_radius, gravity)
{
  equat_radius = KM_EARTH_RADIUS / equat_radius;
  return volatile_gas_inventory * gravity * (EARTH_SURF_PRES_IN_MILLIBARS / 1000) / pow2(equat_radius);
}

/*--------------------------------------------------------------------------*/
/*   This function returns the boiling point of water in an atmosphere of   */
/*   pressure 'surf_pressure', given in millibars.  The boiling point is    */
/*   returned in units of Kelvin.  This is Fogg's eq.21.                    */
/*--------------------------------------------------------------------------*/

function boiling_point(surf_pressure)
{
  let surface_pressure_in_bars;
  
  surface_pressure_in_bars = surf_pressure / MILLIBARS_PER_BAR;
  return 1.0 / ((Math.log(surface_pressure_in_bars) / -5050.5) + (1.0 / 373.0));
}

/*--------------------------------------------------------------------------*/
/*   This function is Fogg's eq.22.   Given the volatile gas inventory and  */
/*   planetary radius of a planet (in Km), this function returns the        */
/*   fraction of the planet covered with water.                             */
/*   I have changed the function very slightly:   the fraction of Earth's   */
/*   surface covered by water is 71%, not 75% as Fogg used.                 */
/*--------------------------------------------------------------------------*/

function hydro_fraction(volatile_gas_inventory, planet_radius)
{
  let temp;
  temp = (0.71 * volatile_gas_inventory / 1000) * pow2(KM_EARTH_RADIUS / planet_radius);
  if (temp >= 1.0)
    return 1.0;
  else
    return temp;
}

/*--------------------------------------------------------------------------*/
/*   Given the surface temperature of a planet (in Kelvin), this function   */
/*   returns the fraction of cloud cover available.   This is Fogg's eq.23. */
/*   See Hart in "Icarus" (vol 33, pp23 - 39, 1978) for an explanation.     */
/*   This equation is Hart's eq.3.                                          */
/*   I have modified it slightly using constants and relationships from     */
/*   Glass's book "Introduction to Planetary Geology", p.46.                */
/*   The 'CLOUD_COVERAGE_FACTOR' is the amount of surface area on Earth     */
/*   covered by one Kg. of cloud.                                           */
/*--------------------------------------------------------------------------*/

function cloud_fraction(surf_temp, smallest_MW_retained, equat_radius, hydro_fraction)
{
  let water_vapor_in_kg, fraction, surf_area, hydro_mass;
  
  if (smallest_MW_retained > WATER_VAPOR) return 0; else
  {
    surf_area = 4.0 * PI * pow2(equat_radius);
    hydro_mass = hydro_fraction * surf_area * EARTH_WATER_MASS_PER_AREA;
    water_vapor_in_kg = (0.00000001 * hydro_mass) * Math.exp(Q2_36 * (surf_temp - EARTH_AVERAGE_KELVIN));
    fraction = CLOUD_COVERAGE_FACTOR * water_vapor_in_kg / surf_area;
    if (fraction >= 1.0)
      return 1;
    else
      return fraction;
  }
}

/*--------------------------------------------------------------------------*/
/*   Given the surface temperature of a planet (in Kelvin), this function   */
/*   returns the fraction of the planet's surface covered by ice.  This is  */
/*   Fogg's eq.24.  See Hart[24] in Icarus vol.33, p.28 for an explanation. */
/*   I have changed a constant from 70 to 90 in order to bring it more in   */
/*   line with the fraction of the Earth's surface covered with ice, which  */
/*   is approximatly .016 (=1.6%).                                          */
/*--------------------------------------------------------------------------*/

function ice_fraction(hydro_fraction, surf_temp)
{
  let temp;
  
  if (surf_temp > 328.0)surf_temp = 328.0;
  temp = Math.pow(((328.0 - surf_temp) / 90.0), 5.0);
  if (temp > (1.5 * hydro_fraction)) temp = (1.5 * hydro_fraction);
  if (temp >= 1.0)
    return 1;
  else
    return temp;
}

/*--------------------------------------------------------------------------*/
/*  This is Fogg's eq.19.  The ecosphere radius is given in AU, the orbital */
/*  radius in AU, and the temperature returned is in Kelvin.                */
/*--------------------------------------------------------------------------*/

function eff_temp(ecosphere_radius, orb_radius, albedo)
{
  return Math.sqrt(ecosphere_radius / orb_radius) * pow1_4((1.0 - albedo) / (1.0 - EARTH_ALBEDO)) * EARTH_EFFECTIVE_TEMP;
}

function est_temp(ecosphere_radius, orb_radius, albedo)
{
  return Math.sqrt(ecosphere_radius / orb_radius) * pow1_4((1.0 - albedo) / (1.0 - EARTH_ALBEDO)) * EARTH_AVERAGE_KELVIN;
}

/*--------------------------------------------------------------------------*/
/* Old grnhouse:                                                            */
/*  Note that if the orbital radius of the planet is greater than or equal  */
/*  to R_inner, 99% of it's volatiles are assumed to have been deposited in */
/*  surface reservoirs (otherwise, it suffers from the greenhouse effect).  */
/*--------------------------------------------------------------------------*/
/*  if ((orb_radius < r_greenhouse) && (zone == 1))                         */
/*--------------------------------------------------------------------------*/
/*  The new definition is based on the inital surface temperature and what  */
/*  state water is in. If it's too hot, the water will never condense out   */
/*  of the atmosphere, rain down and form an ocean. The albedo used here    */
/*  was chosen so that the boundary is about the same as the old method     */
/*  Neither zone, nor r_greenhouse are used in this version        JLB      */
/*--------------------------------------------------------------------------*/

function grnhouse(r_ecosphere, orb_radius)
{
  let temp = eff_temp(r_ecosphere, orb_radius, GREENHOUSE_TRIGGER_ALBEDO);
  if (temp > FREEZING_POINT_OF_WATER)
    return true;
  else
    return false;
}

/*--------------------------------------------------------------------------*/
/*  This is Fogg's eq.20, and is also Hart's eq.20 in his "Evolution of     */
/*  Earth's Atmosphere" article.  The effective temperature given is in     */
/*  units of Kelvin, as is the rise in temperature produced by the          */
/*  greenhouse effect, which is returned.                                   */
/*  I tuned this by changing a pow(x,.25) to pow(x,.4) to match Venus - JLB */
/*--------------------------------------------------------------------------*/

function green_rise(optical_depth, effective_temp, surf_pressure)
{
  let convection_factor = EARTH_CONVECTION_FACTOR * Math.pow(surf_pressure / EARTH_SURF_PRES_IN_MILLIBARS, 0.4);
  let rise = (pow1_4(1.0 + 0.75 * optical_depth) - 1.0) * effective_temp * convection_factor;
  if (rise < 0.0) rise = 0.0;
  return rise;
}

/*--------------------------------------------------------------------------*/
/*   The surface temperature passed in is in units of Kelvin.               */
/*   The cloud adjustment is the fraction of cloud cover obscuring each     */
/*   of the three major components of albedo that lie below the clouds.     */
/*--------------------------------------------------------------------------*/

function planet_albedo(water_fraction, cloud_fraction, ice_fraction, surf_pressure)
{
  let rock_fraction, cloud_adjustment, components, cloud_part, rock_part, water_part, ice_part;
  
  rock_fraction = 1.0 - water_fraction - ice_fraction;
  components = 0.0;
  if (water_fraction > 0.0) components = components + 1.0;
  if (ice_fraction > 0.0) components = components + 1.0;
  if (rock_fraction > 0.0) components = components + 1.0;
  
  cloud_adjustment = cloud_fraction / components;
  
  if (rock_fraction >= cloud_adjustment)
    rock_fraction = rock_fraction - cloud_adjustment;
  else
    rock_fraction = 0.0;
  
  if (water_fraction > cloud_adjustment)
    water_fraction = water_fraction - cloud_adjustment;
  else
    water_fraction = 0.0;
    
  if (ice_fraction > cloud_adjustment)
    ice_fraction = ice_fraction - cloud_adjustment;
  else
    ice_fraction = 0.0;
    
  cloud_part = cloud_fraction * CLOUD_ALBEDO;    /* about(...,0.2); */
  
  if (surf_pressure === 0.0)
  {
    rock_part = rock_fraction * ROCKY_AIRLESS_ALBEDO;  /* about(...,0.3); */
    ice_part = ice_fraction * AIRLESS_ICE_ALBEDO;    /* about(...,0.4); */
    water_part = 0;
  } else {
    rock_part = rock_fraction * ROCKY_ALBEDO;  /* about(...,0.1); */
    water_part = water_fraction * WATER_ALBEDO;  /* about(...,0.2); */
    ice_part = ice_fraction * ICE_ALBEDO;    /* about(...,0.1); */
  }

  return cloud_part + rock_part + water_part + ice_part;
}

/*--------------------------------------------------------------------------*/
/*   This function returns the dimensionless quantity of optical depth,     */
/*   which is useful in determining the amount of greenhouse effect on a    */
/*   planet.                                                                */
/*--------------------------------------------------------------------------*/

function opacity(molecular_weight, surf_pressure)
{
  let optical_depth;
  
  optical_depth = 0.0;
  if ((molecular_weight >= 0.0) && (molecular_weight < 10.0)) optical_depth = optical_depth + 3.0;
  if ((molecular_weight >= 10.0) && (molecular_weight < 20.0)) optical_depth = optical_depth + 2.34;
  if ((molecular_weight >= 20.0) && (molecular_weight < 30.0)) optical_depth = optical_depth + 1.0;
  if ((molecular_weight >= 30.0) && (molecular_weight < 45.0)) optical_depth = optical_depth + 0.15;
  if ((molecular_weight >= 45.0) && (molecular_weight < 100.0)) optical_depth = optical_depth + 0.05;

  if (surf_pressure >= (70.0 * EARTH_SURF_PRES_IN_MILLIBARS))
    optical_depth = optical_depth * 8.333;
  else if (surf_pressure >= (50.0 * EARTH_SURF_PRES_IN_MILLIBARS))
    optical_depth = optical_depth * 6.666;
  else if (surf_pressure >= (30.0 * EARTH_SURF_PRES_IN_MILLIBARS))
    optical_depth = optical_depth * 3.333;
  else if (surf_pressure >= (10.0 * EARTH_SURF_PRES_IN_MILLIBARS))
    optical_depth = optical_depth * 2.0;
  else if (surf_pressure >= (5.0 * EARTH_SURF_PRES_IN_MILLIBARS))
    optical_depth = optical_depth * 1.5;

  return optical_depth;
}

/*
 *  calculates the number of years it takes for 1/e of a gas to escape
 *  from a planet's atmosphere.
 *  Taken from Dole p. 34. He cites Jeans (1916) & Jones (1923)
 */
 
function gas_life(molecular_weight, planet)
{
  let v = rms_vel(molecular_weight, planet.exospheric_temp);
  let g = planet.surf_grav * EARTH_ACCELERATION;
  let r = planet.radius * CM_PER_KM;
  let t = (pow3(v) / (2.0 * pow2(g) * r)) * Math.exp((3.0 * g * r) / pow2(v));
  let years = t / (SECONDS_PER_HOUR * 24.0 * DAYS_IN_A_YEAR);
  
//  long double ve = planet.esc_velocity;
//  long double k = 2;
//  long double t2 = ((k * pow3(v) * r) / pow4(ve)) * exp((3.0 * pow2(ve)) / (2.0 * pow2(v)));
//  long double years2 = t2 / (SECONDS_PER_HOUR * 24.0 * DAYS_IN_A_YEAR);
//  if (flag_verbose & 0x0040)
//    fprintf (stderr, "gas_life: %LGs, V ratio: %Lf\n",
//        years, ve / v);

  if (years > 2.0E10) years = INCREDIBLY_LARGE_NUMBER;

  return years;
}

function min_molec_weight(planet)
{
  let
    mass    = planet.mass,
    radius  = planet.radius,
    temp    = planet.exospheric_temp,
    target  = 5.0E9,
    guess_1 = molecule_limit(mass, radius, temp),
    guess_2 = guess_1,
    life    = gas_life(guess_1, planet),
    loops   = 0;
  
  if (null !== planet.primary) {
    target = planet.primary.age;
  }

  if (life > target) {
    while ((life > target) && (loops++ < 25)) {
      guess_1 = guess_1 / 2.0;
      life   = gas_life(guess_1, planet);
    }
  } else {
    while ((life < target) && (loops++ < 25)) {
      guess_2 = guess_2 * 2.0;
      life   = gas_life(guess_2, planet);
    }
  }

  loops = 0;

  while (((guess_2 - guess_1) > 0.1) && (loops++ < 25)) {
    let guess_3 = (guess_1 + guess_2) / 2.0;
    life = gas_life(guess_3, planet);

    if (life < target)
      guess_1 = guess_3;
    else
      guess_2 = guess_3;
  }
  
  life = gas_life(guess_2, planet);

  return guess_2;
}

/*--------------------------------------------------------------------------*/
/*   The temperature calculated is in degrees Kelvin.                       */
/*   Quantities already known which are used in these calculations:         */
/*     planet.molec_weight                                                  */
/*     planet.surf_pressure                                                 */
/*     R_ecosphere                                                          */
/*     planet.a                                                             */
/*     planet.volatile_gas_inventory                                        */
/*     planet.radius                                                        */
/*     planet.boil_point                                                    */
/*--------------------------------------------------------------------------*/

function calculate_surface_temp(planet, first, last_water, last_clouds, last_ice, last_temp, last_albedo)
{
  let
    effective_temp,
    water_raw,
    clouds_raw,
    greenhouse_temp,
    boil_off = false;

  if (first) {
    planet.albedo = EARTH_ALBEDO;
    effective_temp = eff_temp(planet.primary.r_ecosphere, planet.a, planet.albedo);
    greenhouse_temp = green_rise(opacity(planet.molec_weight, planet.surf_pressure), effective_temp, planet.surf_pressure);
    planet.surf_temp   = effective_temp + greenhouse_temp;
    set_temp_range(planet);
  }
  
  if (planet.greenhouse_effect && planet.max_temp < planet.boil_point) {
    /*if (flag_verbose & 0x0010)
      fprintf (stderr, "Deluge: %s %d max (%Lf) < boil (%Lf)\n",
          planet.primary.name,
          planet.planet_no,
          planet.max_temp,
          planet.boil_point);*/
    planet.greenhouse_effect = 0;
    planet.volatile_gas_inventory = vol_inventory(planet.mass, planet.esc_velocity, planet.rms_velocity, planet.primary.mass, planet.orbit_zone, planet.greenhouse_effect, (planet.gas_mass / planet.mass) > 0.000001);
    planet.surf_pressure = pressure(planet.volatile_gas_inventory, planet.radius, planet.surf_grav);
    planet.boil_point = boiling_point(planet.surf_pressure);
  }

  water_raw = planet.hydrosphere = hydro_fraction(planet.volatile_gas_inventory, planet.radius);
  clouds_raw = planet.cloud_cover = cloud_fraction(planet.surf_temp, planet.molec_weight, planet.radius, planet.hydrosphere);
  planet.ice_cover = ice_fraction(planet.hydrosphere, planet.surf_temp);
  
  if ((planet.greenhouse_effect) && (planet.surf_pressure > 0.0)) planet.cloud_cover = 1.0;
  
  if ((planet.high_temp >= planet.boil_point) && (!first) && !(Math.trunc(planet.day) == Math.trunc(planet.orb_period * 24.0) || (planet.resonant_period))) {
    planet.hydrosphere  = 0.0;
    boil_off = true;
    if (planet.molec_weight > WATER_VAPOR)
      planet.cloud_cover = 0.0;
    else
      planet.cloud_cover = 1.0;
  }

  if (planet.surf_temp < (FREEZING_POINT_OF_WATER - 3.0)) planet.hydrosphere= 0.0;
  
  planet.albedo = planet_albedo(planet.hydrosphere, planet.cloud_cover, planet.ice_cover, planet.surf_pressure);
  
  effective_temp = eff_temp(planet.primary.r_ecosphere, planet.a, planet.albedo);
  greenhouse_temp = green_rise(opacity(planet.molec_weight, planet.surf_pressure), effective_temp, planet.surf_pressure);
  planet.surf_temp = effective_temp + greenhouse_temp;

  if (!first) {
    if (!boil_off) planet.hydrosphere = (planet.hydrosphere + (last_water * 2)) / 3;
    planet.cloud_cover = (planet.cloud_cover + (last_clouds * 2)) / 3;
    planet.ice_cover = (planet.ice_cover + (last_ice * 2)) / 3;
    planet.albedo = (planet.albedo + (last_albedo * 2)) / 3;
    planet.surf_temp = (planet.surf_temp + (last_temp * 2)) / 3;
  }

  set_temp_range(planet);

  /*if (flag_verbose & 0x0020)
    fprintf (stderr, "%5.1Lf AU: %5.1Lf = %5.1Lf ef + %5.1Lf gh%c "
        "(W: %4.2Lf (%4.2Lf) C: %4.2Lf (%4.2Lf) I: %4.2Lf A: (%4.2Lf))\n",
        planet.a,
        planet.surf_temp - FREEZING_POINT_OF_WATER,
        effective_temp - FREEZING_POINT_OF_WATER,
        greenhouse_temp,
        (planet.greenhouse_effect) ? '*' :' ',
        planet.hydrosphere, water_raw,
        planet.cloud_cover, clouds_raw,
        planet.ice_cover,
        planet.albedo);*/
}

function iterate_surface_temp(planet)
{
  let
    count = 0,
    initial_temp = est_temp(planet.primary.r_ecosphere, planet.a, planet.albedo),
    h2o_life = gas_life (WATER_VAPOR, planet),
    h2_life = gas_life (MOL_HYDROGEN, planet),
    n2_life = gas_life (MOL_NITROGEN, planet),
    n_life = gas_life (ATOMIC_NITROGEN, planet);
  
  /*if (flag_verbose & 0x0040)
    fprintf (stderr, "\nGas lifetimes: H2 - %Lf, H2O - %Lf, N - %Lf, N2 - %Lf\n",
        h2_life, h2o_life, n_life, n2_life);*/

  calculate_surface_temp(planet, true, 0, 0, 0, 0, 0);

  for (count = 0; count <= 25; count++) {
    let
      last_water = planet.hydrosphere,
      last_clouds = planet.cloud_cover,
      last_ice = planet.ice_cover,
      last_temp = planet.surf_temp,
      last_albedo = planet.albedo;
  
    calculate_surface_temp(planet, false, last_water, last_clouds, last_ice, last_temp, last_albedo);
    
    if (Math.abs(planet.surf_temp - last_temp) < 0.25) break;
  }
  
  planet.greenhs_rise = planet.surf_temp - initial_temp;
}

/*--------------------------------------------------------------------------*/
/*   Inspired partial pressure, taking into account humidification of the   */
/*   air in the nasal passage and throat This formula is on Dole's p. 14    */
/*--------------------------------------------------------------------------*/

function inspired_partial_pressure(surf_pressure, gas_pressure)
{
  let
    pH2O = H20_ASSUMED_PRESSURE,
    fraction = gas_pressure / surf_pressure;
    
  return (surf_pressure - pH2O) * fraction;
}

/*--------------------------------------------------------------------------*/
/*   This function uses figures on the maximum inspired partial pressures   */
/*   of Oxygen, other atmospheric and traces gases as laid out on pages 15, */
/*   16 and 18 of Dole's Habitable Planets for Man to derive breathability  */
/*   of the planet's atmosphere.                                       JLB  */
/*--------------------------------------------------------------------------*/

function breathability(planet)
{
  let
    oxygen_ok = false,
    index;

  if (planet.gases === 0) return NONE;
  
  for(index = 0; index < planet.gases; index++)
  {
    let n;
    let gas_no = 0;
    
    let ipp = inspired_partial_pressure (planet.surf_pressure, planet.atmosphere[index].surf_pressure);
    
    for (n = 0; n < max_gas; n++) {
      if (gases[n].num == planet.atmosphere[index].num) gas_no = n;
    }

    if (ipp > gases[gas_no].max_ipp)
      return POISONOUS;
      
    if (planet.atmosphere[index].num == AN_O) oxygen_ok = ((ipp >= MIN_O2_IPP) && (ipp <= MAX_O2_IPP));
  }
  
  if (oxygen_ok)
    return BREATHABLE;
  else
    return UNBREATHABLE;
}

/* function for 'soft limiting' temperatures */

function lim(x)
{
  return x / Math.sqrt(Math.sqrt(1 + x*x*x*x));
}

function soft(v, max, min)
{
  let dv = v - min;
  let dm = max - min;
  return (lim(2*dv/dm-1)+1)/2 * dm + min;
}

function set_temp_range(planet)
{
  let
    pressmod = 1 / Math.sqrt(1 + 20 * planet.surf_pressure / 1000.0),
    ppmod    = 1 / Math.sqrt(10 + 5 * planet.surf_pressure / 1000.0),
    tiltmod  = Math.abs(Math.cos(planet.axial_tilt * PI/180) * Math.pow(1 + planet.e, 2)),
    daymod   = 1 / (200 / planet.day + 1),
    mh = Math.pow(1 + daymod, pressmod),
    ml = Math.pow(1 - daymod, pressmod),
    hi = mh * planet.surf_temp,
    lo = ml * planet.surf_temp,
    sh = hi + Math.pow((100+hi) * tiltmod, Math.sqrt(ppmod)),
    wl = lo - Math.pow((150+lo) * tiltmod, Math.sqrt(ppmod)),
    max = planet.surf_temp + Math.sqrt(planet.surf_temp) * 10,
    min = planet.surf_temp / Math.sqrt(planet.day + 24);

  if (lo < min) lo = min;
  if (wl < 0)   wl = 0;

  planet.high_temp = soft(hi, max, min);
  planet.low_temp  = soft(lo, max, min);
  planet.max_temp  = soft(sh, max, min);
  planet.min_temp  = soft(wl, max, min);
}