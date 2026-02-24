import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCmsContent } from '@/lib/context/CmsContentContext';
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
  const { c } = useCmsContent();
  const ct = (key, options) => c(key) || t(key, options);
  
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
    firstName: string().required(ct('nameRequired')),
    lastName: string().required(ct('lastNameRequired')),
    type: string().required(ct('typeRequired')),
    country: string().required(ct('countryRequired')),
    title: string().required(ct('titleRequired')),
    address: string().required(ct('adressRequired')),
    name: string().required(ct('nameRequired')),
    email: string().email().required(ct('emailRequired')),
    phone: string().required(ct('phoneRequired')),
    sex: string().required(ct('sexRequired'))
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
      showSuccess(ct('agencyMentorForm.requestSubmittedSuccess'))
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
        label={ct('Agency Name')}
        placeholder={ct('Agency Name')}
        value={name}
        onChange={setName}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={ct('Title')}
        placeholder={ct('Title')}
        onChange={setTitle}
        value={title}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={ct('Manager Name')}
        placeholder={ct('Manager Name')}
        onChange={setFirstName}
        value={firstName}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={ct('Manager Last Name')}
        placeholder={ct('Manager Last Name')}
        onChange={setLastName}
        value={lastName}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={ct('Email')}
        placeholder={ct('Email')}
        onChange={setEmail}
        value={email}
        className="w-full"
        labelClassName="font-medium"
      />
      <SelectInput
        label={ct('Country')}
        placeholder={ct('Country')}
        options={countryOptions}
        onSelect={setCountry}
        value={country}
        isMulti
        className="w-full"
        labelClassName="font-medium"
      />
      <SelectInput
        label={ct('Sex')}
        placeholder={ct('Sex')}
        onSelect={setSex}
        value={sex}
        options={gendersOptions}
        isMulti
        className="w-full"
        labelClassName="font-medium"
      />
      <PhoneInput
        label={ct('Phone')}
        placeholder={ct('Phone')}
        onChange={setPhone}
        value={phone}
        className="w-full"
        labelClassName="font-medium"
      />
      <Input
        label={ct('Address')}
        placeholder={ct('Address')}
        onChange={setAddress}
        value={address}
        className="w-full"
        labelClassName="font-medium"
      />
      <PrimaryButton
        onClick={handleSubmit}
        text={ct('Submit')}
        className="w-fit mt-5"
      />
    </Fragment>
  );
}

export default AgencyMentorForm;
