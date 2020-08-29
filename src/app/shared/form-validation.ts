import { FormArray, FormControl, FormGroup } from "@angular/forms";

export class FormValidations {
    static requireMinCheckbox(min = 1) {
        const validator = (array: FormArray) => {
            // const values = array.controls;
            // let totalChecked = 0;
            // for (let i = 0; i < array.length; i++) {
            //   if (values[i].value) {
            //     totalChecked++;
            //   }
            // }
            const totalChecked = array.controls
                .map((v) => (v.value))
                .reduce((total, current) => (current ? total + current : total), 0);

            return totalChecked >= min ? null : { required: true };
        };

        return validator;
    }

    static cepValidator(controle: FormControl) {
        const cep = controle.value;
        if (cep && cep !== '') {
            const validacep = /^[0-9]{8}$/;
            return validacep.test(cep) ? null : { cepInvalido: true };
        }

        return null;
    }

    static equalsTo(otherField: string) {
        const validator = (controle: FormControl) => {
            if (otherField == null) {
                throw new Error('É necessário informar um campo.');
            }

            if (!controle.root || !(controle.root as FormGroup).controls) {
                return null;
            }

            const field = (controle.root as FormGroup).get(otherField);

            if (!field) {
                throw new Error('É necessário informar um campo válido.');
            }

            if (field.value !== controle.value) {
                return { equalsTo : otherField };
            }

            return null;
        };
        return validator;
    }

    static getErrorMessage(fieldName: string, validatorName: string, validatorValue?: any) {
        const config = {
            'required': `${fieldName} é um campo obrigatório.`,
            'minlength': `${fieldName} precisa de, no mínimo, ${validatorValue.requiredLength} caracteres.`,
            'maxlength': `${fieldName} precisa de, no máximo, ${validatorValue.requiredLength} caracteres.`,
            'cepInvalido': 'CEP inválido.',
            'emailInvalido': 'Email já cadastrado!',
            'equalsTo': 'E-mails não são iguais.',
        }

        return config[validatorName];
    }
}