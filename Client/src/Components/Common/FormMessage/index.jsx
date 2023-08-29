import { FormGroup, FormFeedback, Input, InputGroup } from "reactstrap";

const FormMessage = ({ errorFlag, message }) => {
    if (!message)
        return;
    return (
        <FormGroup className="mt-3">
            <InputGroup>
                <Input type="hidden" invalid={errorFlag} valid={!errorFlag} />
                <FormFeedback valid={!errorFlag} tooltip >
                    {message}
                </FormFeedback>
            </InputGroup>
        </FormGroup>
    );
}

export default FormMessage;