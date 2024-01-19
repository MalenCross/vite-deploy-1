export type TaxOutput = {
    taxableIncome : number,
    incomeTax : number,
    ficaTax : number,
    totalTax: number,
    taxAfterCredits: number,
    takeHomePay: number
}
type TaxBracket = {
    min: number,
    max: number,
    rate: number
};

export const SingleTaxBrackets: TaxBracket[] = [
    { min: 0, max: 10275, rate: .10 },
    { min: 10276, max: 41775, rate: .12 },
    { min: 41776, max: 89075, rate: .22 },
    { min: 89076, max: 170050, rate: .24 },
    { min: 170051, max: 215950, rate: .32 },
    { min: 215951, max: 539900, rate: .35 },
    { min: 539901, max: Infinity, rate: .37 }
];

export const MarriedTaxBrackets: TaxBracket[] = [
    { min: 0, max: 22000, rate: .10 },
    { min: 22001, max: 89450, rate: .12 },
    { min: 89451, max: 190750, rate: .22 },
    { min: 190751, max: 364200, rate: .24 },
    { min: 3642001, max: 462500, rate: .32 },
    { min: 462501, max: 693750, rate: .35 },
    { min: 693751, max: Infinity, rate: .37 }
];

const StandardDeductions = {
    single: 12950,
    married: 25900, 
};

export function calculateTaxableIncome(grossIncome: number, deductions: number): number {
    return Math.max(0, grossIncome - deductions);
}
export function calculateIncomeTax(taxableIncome: number, taxBrackets: TaxBracket[]): number {
    let taxOwed = 0;
    for (const bracket of taxBrackets) {
        if (taxableIncome > bracket.min) {
            let taxableAmount = Math.min(taxableIncome, bracket.max) - bracket.min;
            taxOwed += taxableAmount * bracket.rate;
            if (taxableIncome < bracket.max) {
                break;
            }
        }
    }
    return taxOwed;
}
export function TotalFicaTax(taxableIncome: number): number {
let medicareTaxes = taxableIncome * .0145
if (taxableIncome > 160200) {
    taxableIncome = 160200
}
let ssTax = taxableIncome * .062

return parseFloat((ssTax + medicareTaxes).toFixed(2)); 
   
}
export function calculateTotalTax(grossIncome: number, filingStatus: 'single' | 'married', credits: number, retirementContribution : number): TaxOutput {
    const deductions = StandardDeductions[filingStatus];
    const taxableIncomeAfterRetirement= grossIncome -retirementContribution
    const taxableIncome = calculateTaxableIncome(taxableIncomeAfterRetirement, deductions);
    const taxBrackets = filingStatus === 'single' ? SingleTaxBrackets : MarriedTaxBrackets;
    const incomeTax = calculateIncomeTax(taxableIncome, taxBrackets);
    const ficaTax = TotalFicaTax(taxableIncome)
    const totalTax = incomeTax + ficaTax
    const taxAfterCredits = totalTax - credits
    const takeHomePay = grossIncome - taxAfterCredits

    return {taxableIncome : taxableIncome,
        incomeTax : incomeTax,
        ficaTax : ficaTax,
        totalTax: totalTax,
        taxAfterCredits: taxAfterCredits,
        takeHomePay: takeHomePay - retirementContribution
    }
}








