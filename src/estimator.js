var input = {
        region: { 
            name: "Africa",
            avgAge: 19.7,
            avgDailyIncomeInUSD: 5,
            avgDailyIncomePopulation: 0.71 },
        periodType: "days",
        timeToElapse: 58,
        reportedCases: 674,
        population: 66622705,
        totalHospitalBeds: 1380614
    }

var output = 
    {
        data: {
            region: { 
                name: "Africa",
                avgAge: 19.7,
                avgDailyIncomeInUSD: 5,
                avgDailyIncomePopulation: 0.71 },
            periodType: "days",
            timeToElapse: 58,
            reportedCases: 674,
            population: 66622705,
            totalHospitalBeds: 1380614
        },          // the input data you got
        impact: {
            currentlyInfected: 0,
            infectionsByRequestedTime: 0,
            severeCasesByRequestedTime: 0,
            hospitalBedsByRequestedTime: 0,
            casesForICUByRequestedTime: 0,
            casesForVentilatorsByRequestedTime: 0,
            dollarsInFlight:0
        },        // your best case estimation
        severeImpact: {
            currentlyInfected: 0,
            infectionsByRequestedTime: 0,
            severeCasesByRequestedTime: 0,
            hospitalBedsByRequestedTime: 0,
            casesForICUByRequestedTime: 0,
            casesForVentilatorsByRequestedTime: 0,
            dollarsInFlight:0
        }   // your severe case estimation
     }; 

const covid19ImpactEstimator = (data) => {
    //output data{} = input data
    output.data = data;

    //(severe) impact reported cases
    var casesReported = data.reportedCases;
    output.impact.currentlyInfected = casesReported * 10;
    output.severeImpact.currentlyInfected = casesReported * 50;

    //estimate no. of infected in 28 days
    var factor = data.timeToElapse / 3;
    var impactInfectionsByTime = output.impact.infectionsByRequestedTime;
    var severeInfectionsByTime = output.severeImpact.infectionsByRequestedTime;

    impactInfectionsByTime = output.impact.currentlyInfected * 2 ^ factor;
    severeInfectionsByTime = output.severeImpact.currentlyInfected * 2 ^ factor;

    //require hospitalisation
    output.impact.severeCasesByRequestedTime = output.impact.infectionsByRequestedTime * 0.15;
    output.severeImpact.severeCasesByRequestedTime = output.severeImpact.infectionsByRequestedTime * 0.15;

    //available beds
    var severeImpactCases = output.impact.severeCasesByRequestedTime;
    output.impact.hospitalBedsByRequestedTime = data.totalHospitalBeds * 0.35 - severeImpactCases;

    var severeCases = output.severeImpact.severeCasesByRequestedTime;
    output.severeImpact.hospitalBedsByRequestedTime = data.totalHospitalBeds * 0.35 - severeCases;
 
    //require ICU care
    output.impact.casesForICUByRequestedTime = impactInfectionsByTime * 0.05;
    output.severeImpact.casesForICUByRequestedTime = severeInfectionsByTime * 0.05;

    //need ventilators in the ICU
    output.impact.casesForVentilatorsByRequestedTime = impactInfectionsByTime * 0.02;
    output.severeImpact.casesForVentilatorsByRequestedTime = severeInfectionsByTime * 0.02;

    //money lost in the economy
    var dailyPopIncome = data.region.avgDailyIncomePopulation;
    var dailyDollarIncome = data.region.avgDailyIncomeInUSD;

    output.impact.dollarsInFlight = impactInfectionsByTime * dailyPopIncome * dailyDollarIncome * data.timeToElapse;
    output.severeImpact.dollarsInFlight = severeInfectionsByTime * dailyPopIncome * dailyDollarIncome * data.timeToElapse;
};

covid19ImpactEstimator(input);
export default covid19ImpactEstimator;
