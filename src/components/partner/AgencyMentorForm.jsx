import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json'
import { object, string } from 'yup';
import { gendersOptions } from '@constants/filters';
import { showError, showSuccess } from '@utils/toast';
import { PartnerService, AuthService } from '@api/services';
import { Input, SelectInput, PhoneInput } from '@components/core/inputs';
import { PrimaryButton } from '@components/core/buttons';

const getCountryOptions = () => {
  countries.registerLocale(enLocale)
  const countryObj = countries.getNames('en', { select: 'official' })
  
  return Object.entries(countryObj).map(([key, value]) => {
    return { label: value, value: key }
  })
}

const countryOptions = getCountryOptions()

const AgencyMentorForm = ({ type, onSubmit }) => {
  const { t } = useTranslation();
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [sex, setSex] = useState([])
  const [country, setCountry] = useState([])
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  
  const payloadSchema = object({
    firstName: string().required(t('nameRequired')),
    lastName: string().required(t('lastNameRequired')),
    type: string().required(t('typeRequired')),
    country: string().required(t('countryRequired')),
    title: string().required(t('titleRequired')),
    address: string().required(t('adressRequired')),
    name: string().required(t('nameRequired')),
    email: string().email().required(t('emailRequired')),
    phone: string().required(t('phoneRequired')),
    sex: string().required(t('sexRequired'))
  })
  
  const handleSubmit = async () => {
    try {
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        sex: sex?.value,
        type,
        country: country?.value,
        title,
        address,
        name
      }
      
      await payloadSchema.validate({ ...payload })
      await AuthService.validateEmailDoesNotExists(email)
      
      const statusPayload = new FormData();
      Object.keys(payload).forEach((key) => {
        payload[key] !== undefined && statusPayload.append(key, payload[key])
      })
      
      await PartnerService.createPartnerRequest(statusPayload)
      showSuccess(t('agencyMentorForm.requestSubmittedSuccess'))
      onSubmit?.()
      
      setAddress('')
      setName('')
      setEmail('')
      setFirstName('')
      setLastName('')
      setPhone('')
      setSex([])
      setCountry([])
      setTitle('')
    } catch (error) {
      showError(error.message)
    }
  }

  return (
    <Fragment>
      <Input
        label={t('Agency Name')}
        placeholder={t('Agency Name')}
        value={name}
        onChange={setName}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={t('Title')}
        placeholder={t('Title')}
        onChange={setTitle}
        value={title}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={t('Manager Name')}
        placeholder={t('Manager Name')}
        onChange={setFirstName}
        value={firstName}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={t('Manager Last Name')}
        placeholder={t('Manager Last Name')}
        onChange={setLastName}
        value={lastName}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={t('Email')}
        placeholder={t('Email')}
        onChange={setEmail}
        value={email}
        className="w-full"
        labelClassName="font-medium"
      />
      <SelectInput
        label={t('Country')}
        placeholder={t('Country')}
        options={countryOptions}
        onSelect={setCountry}
        value={country}
        isMulti
        className="w-full"
        labelClassName="font-medium"
      />
      <SelectInput
        label={t('Sex')}
        placeholder={t('Sex')}
        onSelect={setSex}
        value={sex}
        options={gendersOptions}
        isMulti
        className="w-full"
        labelClassName="font-medium"
      />
      <PhoneInput
        label={t('Phone')}
        placeholder={t('Phone')}
        onChange={setPhone}
        value={phone}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={t('Address')}
        placeholder={t('Address')}
        onChange={setAddress}
        value={address}
        className="w-full"
        labelClassName="font-medium"
      />
      <PrimaryButton
        onClick={handleSubmit}
        text={t('Submit')}
        className="w-fit mt-5"
      />
    </Fragment>
  );
}

export default AgencyMentorForm;
