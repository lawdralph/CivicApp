import { useRef, useState } from 'react'

function FileUpload({ label = 'Upload a photo', required = true, onFileSelect, error }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFile = (file) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be 5MB or less.')
      return
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      alert('Please upload JPG, JPEG, or PNG image only.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      setFileName(file.name)
      if (onFileSelect) onFileSelect(file)
    }
    reader.readAsDataURL(file)
  }

  const onDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const onInputChange = (event) => {
    const file = event.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label className="label">{label}{required ? ' *' : ''}</label>
      <div
        className={`mt-2 rounded-2xl border-2 border-dashed p-5 text-center transition ${error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50'}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            fileInputRef.current?.click()
          }
        }}
      >
        {preview ? (
          <div className="space-y-3">
            <img src={preview} alt="Selected report preview" className="mx-auto h-48 w-full rounded-xl object-cover" />
            <p className="text-sm font-medium text-slate-700">{fileName}</p>
            <button
              type="button"
              className="text-sm font-semibold text-sky-700 underline"
              onClick={(event) => {
                event.stopPropagation()
                setPreview('')
                setFileName('')
                if (onFileSelect) onFileSelect(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            >
              Remove and replace
            </button>
          </div>
        ) : (
          <div className="space-y-2 py-6">
            <div className="text-3xl">📷</div>
            <p className="text-base font-semibold text-slate-700">Upload a photo</p>
            <p className="text-sm text-slate-500">Drag & drop or click to browse</p>
            <p className="text-xs text-slate-500">JPG, PNG up to 5MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={onInputChange}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

export default FileUpload
