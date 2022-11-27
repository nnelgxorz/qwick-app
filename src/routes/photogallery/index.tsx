import { component$, useServerMount$, useStore } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";


export type ImageType = {
  id: number;
  JobID: number;
  key: string;
  name: string;
  local_url: string;
  bucket_url: string;
  is_selected: boolean;
};

export type Data = {
  id: number;
  CustomerID: number;
  aws_id: string;
  status: number;
  length: number;
  images: ImageType[];
};

////////////////////////////////////////////////////////////////////
export const selectionDone = async (state: any) => {
  const inputData: Data = state.data;
  fetch(
    "http://ec2-65-0-55-55.ap-south-1.compute.amazonaws.com:3000/updatefolder",
    {
      mode: "no-cors",
      method: "POST",
      body: JSON.stringify(inputData),
      headers: { "Content-Type": "application/json" },
    }
  )
    .then(async (json) => await json.text())
    .then((data) => console.log(data))
    .catch((eror) => console.error(eror));
};

export const saveFolder = async (state: any) => {
  const inputData: Data = state.data;
  fetch(
    "http://ec2-65-0-55-55.ap-south-1.compute.amazonaws.com:3000/updatefolder",
    {
      mode: "no-cors",
      method: "POST",
      body: JSON.stringify(inputData),
      headers: { "Content-Type": "application/json" },
    }
  )
    .then(async (json) => await json.text())
    .then((data) => console.log(data))
    .catch((eror) => console.error(eror));
};
/////////////////////////////////////////////////////////////////////////
export default component$(() => {
  const loc = useLocation();
  const uid: string = loc.query.uid;
  const folderid: string = loc.query.folder;
  let data: Data = {
    id: 0,
    CustomerID: 0,
    aws_id: "",
    status: 0,
    length: 0,
    images: [],
  };
  const store = useStore({ data: data }, { recursive: true });
  useServerMount$(async () => {
    const url =
      "http://ec2-65-0-55-55.ap-south-1.compute.amazonaws.com:3000/getfolder?uid=" +
      uid +
      "&aws_id=" +
      folderid;
    const res = await fetch(url);
    store.data = await res.json();
    store.data.status = 2;
    // this function run here perfectly we can see console log in terminal but 
    // when i use this func on button => onclick it does not work my backend though 400 BAD REQUEST at the bottom 
    // To reproduce run project with npm start go to link this  http://localhost:5173/photogallery/?uid=3&folder=jhk and 
    // open browser console click on any button then see result 
    await saveFolder(store);
  });

  return (
    <div className="w-auto h-auto">
      <div className="sticky top-0 z-30  px-2 py-4 bg-white justify-center items-center sm:px-4 shadow">
        <a href="/" className="text-xl font-semibold text-indigo-600 ">
          Photo Gallery
        </a>
      </div>
      <dialog>Heelo</dialog>
      <div className="grid lg:grid-cols-4 gap-10 p-5 ">
        {store.data.images.map((image) => (
          <button
            onClick$={() => {
              image.is_selected = !image.is_selected;
              console.log(image.is_selected);
            }}
          >
            <img
              src={image.bucket_url}
              className="pointer-events-none hover:shadow-2xl rounded-xl"
            />
            <div className="flex flex-row justify-between items-center">
              <h6 className="text-base py-2 ">{image.name}</h6>
              {image.is_selected ? (
                <img
                  className="w-5 m-3 "
                  src="https://www.kindpng.com/picc/m/697-6979063_instagram-like-icon-png-clipart-png-download-love.png"
                  alt=""
                />
              ) : (
                <img
                  className="w-6 m-3"
                  src="https://www.kindpng.com/picc/m/169-1694281_heart-symbol-computer-icons-heart-icon-instagram-png.png"
                  alt=""
                />
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="sticky bottom-0 flex flex-row bg-white lg:justify-end justify-between items-center  px-5 min-w-screen">
        <button
          onClick$={async () => await saveFolder(store)}
          className="m-3 flex items-center justify-center rounded-full  peer-hover:bg-indigo-600 py-2 px-3 text-base font-medium text-indigo-700 hover:bg-indigo-100 "
        >
          Save Selection
        </button>
        <button
          onClick$={async () => await selectionDone(store)}
          className="m-3 flex items-center justify-center rounded-full  peer-hover:bg-indigo-600 py-2 px-3 text-base font-medium text-indigo-700 hover:bg-indigo-100 "
        >
          Selection Done
        </button>
      </div>
    </div>
  );
});

