import { SAPDSessionState } from '../Interfaces';

export const collectSAPDSessionState = (page: Document): SAPDSessionState => {
    const viewStateInput = <HTMLInputElement>page.getElementById('__VIEWSTATE');
    const viewState: string = viewStateInput.value;

    const viewStateGeneratorInput = <HTMLInputElement>page.getElementById('__VIEWSTATEGENERATOR');
    const viewStateGenerator: string = viewStateGeneratorInput.value;

    const eventValidationInput = <HTMLInputElement>page.getElementById('__EVENTVALIDATION');
    const eventValidation: string = eventValidationInput.value;

    if (!viewState || !viewStateGenerator || !eventValidation) {
        throw new Error('Required state input fields are not present in document');
    }

    return {
        __VIEWSTATE: viewState,
        __VIEWSTATEGENERATOR: viewStateGenerator,
        __EVENTVALIDATION: eventValidation
    };
}