import Checkbox, { CheckboxProps } from '@/components/elements/inputs/CheckboxOld'
import { FieldProps, Field as FormikField } from 'formik'
import { forwardRef } from 'react'

const CheckboxFormik = forwardRef<HTMLInputElement, Omit<CheckboxProps, 'error'>>(({ name, ...props }, ref) => {
    return (
        <FormikField innerRef={ref} name={name}>
            {({ field: { value, ...field }, meta: { error, touched } }: FieldProps) => (
                <Checkbox checked={value} {...field} {...props} error={touched ? error : undefined} />
            )}
        </FormikField>
    )
})

export default CheckboxFormik
