import { Label } from '#/components/ui/label'
import { ImageUploadView } from '#/components/image-upload-view'
import { UploadWidget } from '#/components/upload-widget'
import { tempStore } from '#/state/temp.store'

const EXAMPLE_IMAGES = ['1.png', '2.png', '3.jpeg', '4.jpeg', '5.webp', '6.jpeg']

export function ImagesStep({ auctionId }: { auctionId: string }) {
  const tempAuction = tempStore((s) => s.tempAuction)
  const updateTempAuction = tempStore((s) => s.updateTempAuction)

  async function deleteFile(url?: string | null) {
    const dbWrite = (await import('#/services/db-write.service')).default
    dbWrite.deleteFile(url)
  }

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <div className="flex w-full flex-col items-start gap-2">
        <Label>Cover image</Label>
        <div className="grid w-full grid-cols-3 gap-4 sm:grid-cols-4">
          {tempAuction.cover ? (
            <ImageUploadView
              url={tempAuction.cover}
              onClear={() => {
                deleteFile(tempAuction.cover)
                updateTempAuction({ cover: undefined })
              }}
            />
          ) : (
            <UploadWidget
              max={1}
              path={`images/auctions/${auctionId}`}
              updateFiles={(files) => updateTempAuction({ cover: files[0].url })}
            />
          )}
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <Label>Gallery Images</Label>
        <div className="grid w-full grid-cols-3 gap-4 sm:grid-cols-4">
          <UploadWidget
            path={`images/auctions/${auctionId}`}
            updateFiles={(images) =>
              updateTempAuction({
                images: [...images.map((el) => el.url!), ...(tempAuction.images || [])],
              })
            }
          />
          {(!tempAuction.images || tempAuction.images.length < 1) &&
            EXAMPLE_IMAGES.map((img) => (
              <div key={img} className="relative aspect-square w-full">
                <div className="absolute inset-0 rounded-xl bg-black/30" />
                <span className="absolute bottom-2 left-2 text-xs font-semibold text-warning sm:text-sm">
                  sample image
                </span>
                <img
                  src={`/images/examples/${img}`}
                  className="size-full rounded-xl object-cover"
                  alt=""
                />
              </div>
            ))}
          {tempAuction.images?.map((item) => (
            <ImageUploadView
              key={item}
              url={item}
              title="click to set as cover image"
              onClick={() => updateTempAuction({ cover: item })}
              onClear={() => {
                deleteFile(item)
                updateTempAuction({
                  images: tempAuction.images?.filter((el) => el !== item),
                })
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
