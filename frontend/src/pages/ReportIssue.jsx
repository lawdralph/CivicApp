import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FileUpload from '../components/FileUpload'
import Input from '../components/Input'
import Select from '../components/Select'
import Textarea from '../components/Textarea'
import LocationPicker from '../components/LocationPicker'
import ErrorMessage from '../components/ErrorMessage'
import { apiService } from '../services/api'

const categoryOptions = [
  { value: 'Road', label: 'Road' },
  { value: 'Drainage', label: 'Drainage' },
  { value: 'Streetlight', label: 'Streetlight' },
  { value: 'Waste', label: 'Waste' },
  { value: 'Water Supply', label: 'Water Supply' },
  { value: 'Flooding', label: 'Flooding' },
  { value: 'Public Infrastructure', label: 'Public Infrastructure' },
  { value: 'Other', label: 'Other' },
]

function ReportIssue() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
  })
  const [photo, setPhoto] = useState(null)
  const [location, setLocation] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const onFieldChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.title.trim()) nextErrors.title = 'Issue title is required.'
    if (!form.category) nextErrors.category = 'Please select a category.'
    if (!form.description.trim()) nextErrors.description = 'Description is required.'
    if (!photo) nextErrors.photo = 'A photo is required.'
    if (!location || !location.lat || !location.lng) nextErrors.location = 'Location must be captured before submitting.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('latitude', String(location.lat))
      formData.append('longitude', String(location.lng))
      formData.append('photo', photo)

      const response = await apiService.createReport(formData)
      if (response?.reportId) {
        localStorage.setItem('lastReport', JSON.stringify(response))
        localStorage.setItem('lastReportId', response.reportId)
      }
      navigate('/report/success', { state: { report: response } })
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.'
      setSubmitError(backendMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Report an issue</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Tell us what needs attention</h1>
      </div>

      <form className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
        <Input
          id="title"
          name="title"
          label="What is the issue?"
          placeholder="Large pothole on the road"
          value={form.title}
          onChange={onFieldChange}
          error={errors.title}
        />

        <Select
          id="category"
          name="category"
          label="Category"
          options={categoryOptions}
          value={form.category}
          onChange={onFieldChange}
          error={errors.category}
        />

        <Textarea
          id="description"
          name="description"
          label="Description"
          placeholder="Describe what happened and provide any useful details..."
          value={form.description}
          onChange={onFieldChange}
          error={errors.description}
        />

        <FileUpload
          onFileSelect={(selected) => {
            setPhoto(selected)
            setErrors((current) => ({ ...current, photo: '' }))
          }}
          error={errors.photo}
        />

        <LocationPicker
          onLocationSelect={(nextLocation) => {
            setLocation(nextLocation)
            setErrors((current) => ({ ...current, location: '' }))
          }}
          error={errors.location}
        />

        {submitError ? <ErrorMessage message={submitError} /> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
        </Button>
      </form>
    </div>
  )
}

export default ReportIssue
