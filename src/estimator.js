/* eslint-disable linebreak-style */
const input = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};


const covid19ImpactEstimator = (data) => {
  const output = {
    data: input, // the input data you got
    impact: {
      currentlyInfected: 0,
      infectionsByRequestedTime: 0,
      severeCasesByRequestedTime: 0,
      hospitalBedsByRequestedTime: 0,
      casesForICUByRequestedTime: 0,
      casesForVentilatorsByRequestedTime: 0,
      dollarsInFlight: 0
    }, // your best case estimation
    severeImpact: {
      currentlyInfected: 0,
      infectionsByRequestedTime: 0,
      severeCasesByRequestedTime: 0,
      hospitalBedsByRequestedTime: 0,
      casesForICUByRequestedTime: 0,
      casesForVentilatorsByRequestedTime: 0,
      dollarsInFlight: 0
    } // your severe case estimation
  };

  // (severe) impact reported cases
  const casesReported = data.reportedCases;
  output.impact.currentlyInfected = casesReported * 10;
  output.severeImpact.currentlyInfected = casesReported * 50;

  // convert period-type to days
  if (data.periodType === 'weeks') {
    data.timeToElapse *= 7;
  }
  if (data.periodType === 'months') {
    data.timeToElapse *= 30;
  } else {
    // estimate no. of infected in 28 days
    const fa = data.timeToElapse / 3;
    output.impact.infectionsByRequestedTime = output.impact.currentlyInfected * 2 ** fa;
    output.severeImpact.infectionsByRequestedTime = output.severeImpact.currentlyInfected * 2 ** fa;
  }

  // require hospitalisation
  const numOfSevereInfections = output.severeImpact.infectionsByRequestedTime;
  output.impact.severeCasesByRequestedTime = output.impact.infectionsByRequestedTime * 0.15;
  output.severeImpact.severeCasesByRequestedTime = numOfSevereInfections * 0.15;

  // available beds
  const severeImpactCases = output.impact.severeCasesByRequestedTime;
  output.impact.hospitalBedsByRequestedTime = data.totalHospitalBeds * 0.35 - severeImpactCases;
  const severeCases = output.severeImpact.severeCasesByRequestedTime;
  output.severeImpact.hospitalBedsByRequestedTime = data.totalHospitalBeds * 0.35 - severeCases;

  // require ICU care
  const impactInfectionsByTime = output.impact.infectionsByRequestedTime;
  const severeInfectionsByTime = output.severeImpact.infectionsByRequestedTime;
  output.impact.casesForICUByRequestedTime = impactInfectionsByTime * 0.05;
  output.severeImpact.casesForICUByRequestedTime = severeInfectionsByTime * 0.05;

  // need ventilators in the ICU
  output.impact.casesForVentilatorsByRequestedTime = impactInfectionsByTime * 0.02;
  output.severeImpact.casesForVentilatorsByRequestedTime = severeInfectionsByTime * 0.02;

  // money lost in the economy
  const popInc = data.region.avgDailyIncomePopulation;
  const dInc = data.region.avgDailyIncomeInUSD;
  output.impact.dollarsInFlight = impactInfectionsByTime * popInc * dInc * data.timeToElapse;
  output.severeImpact.dollarsInFlight = severeInfectionsByTime * popInc * dInc * data.timeToElapse;

  return output;
};

export default covid19ImpactEstimator;
