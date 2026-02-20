import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import { BsFillFileCheckFill} from 'react-icons/bs';
import Link from 'next/link';
import useSWRMutation from 'swr/mutation';
import { Modal, Typography } from 'antd';
import * as yup from 'yup';
import { PartnerService , AuthService} from '@api/services';
import { gendersOptions } from '@constants/filters';
import { appURL } from '@constants/app';
import { showError } from '@utils/toast';
import  { Input, SelectInput, PhoneInput, PasswordInput} from '@components/core/inputs';
import { PrimaryButton } from '@components/core/buttons';

const initialData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  sex: '',
  password: '',
  confirmPassword: '',
}

const ReferenceForm = () => {
  const { t } = useTranslation('common');
  const [data, setData] = useState(initialData);

  const schema = yup.object().shape({
    firstName: yup.string().required(t('labels.referenceForm.firstName')),
    lastName: yup.string().required(t('labels.referenceForm.lastName')),
    email: yup.string().email().required(t('labels.referenceForm.email')),
    phone: yup.string().required(t('labels.referenceForm.phone')),
    sex: yup.string().required(t('labels.referenceForm.gender')),
    password: yup.string().required(t('labels.referenceForm.password')),
  });
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { trigger: createReferrer, error, isMutating } = useSWRMutation(
    'create-referrer',
    async (_, { arg: payload }) => {
      //await AuthService.validateEmailDoesNotExists(payload.email)
      await PartnerService.createReferrer(payload)
    }
  )
  
  const handleDataChange = (key) => (value) => {
    setData({ ...data, [key]: value })
  }
  
  const handleSubmit = async () => {
    try {
      const { confirmPassword, ...mainData } = data
      
      if (mainData.password !== confirmPassword) {
        throw new Error(t('labels.referenceForm.passwordsDoNotMatch'))
      }
      
      const validatedData = await schema.validate({ ...mainData, sex: data.sex?.value })
      await createReferrer(validatedData)
      setIsSubmitted(true)
      
      Modal.success({
        content: (
          <Typography.Text>
            {t('labels.referenceForm.accountCreatedSuccess')}
            <br/>
            {t('labels.referenceForm.verifyEmailTo')}
            &nbsp;
            <Link href={`${appURL}/login`} className="w-fit !underline underline-offset-2">
              {t('labels.referenceForm.loginToDashboard')}
            </Link>
          </Typography.Text>
        ),
        centered: true,
        onOk: () => setData(initialData),
        icon: <RiCheckboxCircleFill className="w-5 min-w-5 h-5 min-h-5 mr-5 text-success"/>
      })
    } catch (error) {
      showError(error.message)
    }
  }
  
  useEffect(() => {
    if (error) {
      showError(error.message)
    }
  }, [error])
  
  return (
    <Fragment>
      <Input
        label={t('labels.referenceForm.firstName')}
        placeholder={t('labels.referenceForm.placeholderFirstName')}
        autoComplete="given-name"
        value={data.firstName}
        onChange={handleDataChange('firstName')}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={t('labels.referenceForm.lastName')}
        placeholder={t('labels.referenceForm.placeholderLastName')}
        autoComplete="family-name"
        value={data.lastName}
        onChange={handleDataChange('lastName')}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={t('labels.referenceForm.email')}
        placeholder={t('labels.referenceForm.placeholderEmail')}
        type="email"
        autoComplete="email"
        value={data.email}
        onChange={handleDataChange('email')}
        className="w-full"
        labelClassName="font-medium"
      />
      <PhoneInput
        label={t('labels.referenceForm.phone')}
        placeholder={t('labels.referenceForm.placeholderPhone')}
        value={data.phone}
        onChange={handleDataChange('phone')}
        className="w-full"
        labelClassName="font-medium"
      />
      <SelectInput
        label={t('labels.referenceForm.gender')}
        placeholder={t('labels.referenceForm.gender')}
        options={gendersOptions}
        value={data.sex}
        onSelect={handleDataChange('sex')}
        className="w-full"
        labelClassName="font-medium"
      />
      <PasswordInput
        label={t('labels.referenceForm.password')}
        placeholder={t('labels.referenceForm.placeholderPassword')}
        autoComplete="new-password"
        value={data.password}
        onChange={handleDataChange('password')}
        className="w-full"
        labelClassName="font-medium"
      />
      <PasswordInput
        label={t('labels.referenceForm.confirmPassword')}
        placeholder={t('labels.referenceForm.placeholderConfirmPassword')}
        value={data.confirmPassword}
        onChange={handleDataChange('confirmPassword')}
        className="w-full"
        labelClassName="font-medium"
      />
      {
        isSubmitted ? (
          <div className="flex items-center gap-2.5 w-fit h-10 mt-5 px-2.5 py-2 bg-success rounded-lg">
            <BsFillFileCheckFill className="w-5 h-5 text-secondary"/>
            <Typography.Text className="font-medium text-secondary leading-none">
              {t('labels.referenceForm.submitted')}
            </Typography.Text>
          </div>
        ) : (
          <PrimaryButton
            onClick={handleSubmit}
            isLoading={isMutating}
            text={t('labels.referenceForm.submit')}
            className="w-fit mt-5"
          />
        )
      }
    </Fragment>
  );
}

export default ReferenceForm;
