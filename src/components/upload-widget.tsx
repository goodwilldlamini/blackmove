import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Upload } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { CustomSpinner } from '#/components/loading'
import { fsStorage } from '#/lib/firebase'
import { toast } from '#/lib/toast'
import type { EdFile } from '#/types/file'

export function UploadWidget({
  updateFiles,
  max,
  children,
  accepted,
  path,
}: {
  updateFiles: (files: EdFile[]) => void
  path: string
  max?: number
  children?: ReactNode
  accepted?: string[]
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const acceptedFileTypes = accepted || ['image/']
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(list: FileList | null) {
    if (!list || list.length < 1) return
    const files = Array.from(list)
    if (files.some((file) => !acceptedFileTypes.some((type) => file.type.includes(type)))) {
      toast.error('One or more files are not supported, please upload pdf and images only')
      return
    }
    if (max && files.length > max) {
      toast.error(`You can only select ${max === 1 ? '1 file' : `a maximum of ${max} files`}`)
      return
    }
    setIsUploading(true)
    try {
      const newList: EdFile[] = []
      for (const file of files) {
        newList.push(await uploadFile(file))
      }
      updateFiles(newList)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsUploading(false)
    }
  }

  function uploadFile(file: File): Promise<EdFile> {
    return new Promise((resolve, reject) => {
      const fileRef = ref(fsStorage, `${path}/${Date.now()}_${file.name}`)
      uploadBytes(fileRef, file)
        .then(async (snapshot) => {
          const url = await getDownloadURL(snapshot.ref)
          resolve({
            url,
            createdAt: new Date(),
            id: crypto.randomUUID(),
            file: { name: file.name, size: file.size, type: file.type },
          })
        })
        .catch(reject)
    })
  }

  function onButtonClick() {
    inputRef.current?.click()
  }

  return (
    <>
      {children ? (
        <div onClick={onButtonClick} className="cursor-pointer">
          {isUploading ? <CustomSpinner /> : children}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            setIsDragActive(true)
            e.preventDefault()
          }}
          onDragLeave={(e) => {
            setIsDragActive(false)
            e.preventDefault()
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragActive(false)
            handleFiles(e.dataTransfer.files)
          }}
          onClick={onButtonClick}
          className={`flex aspect-square w-full max-w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-2 text-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
        >
          {isUploading ? (
            <CustomSpinner />
          ) : (
            <>
              <Upload className="size-6 text-gray-500" />
              <span className="text-xs text-gray-500 sm:text-sm">
                Drag 'n' Drop images
                <br /> or <span className="underline">Browse</span>
              </span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        multiple
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          e.preventDefault()
          handleFiles(e.target.files)
        }}
      />
    </>
  )
}
