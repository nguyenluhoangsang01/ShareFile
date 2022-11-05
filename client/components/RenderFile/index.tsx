import Image from "next/image";
import { FunctionComponent } from "react";
import { sizeInKB } from "../../utils/helpers";

export interface IFile {
  type: string;
  name: string;
  size: number;
}

const RenderFile: FunctionComponent<{ file: IFile }> = ({
  file: { type, name, size },
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Image
          src={`/images/${type.split("/")[1]}.png`}
          alt={type.split("/")[1]}
          width={48}
          height={48}
        />
        <p className="font-medium">{name}</p>
      </div>

      <p>{sizeInKB(size)}</p>
    </div>
  );
};

export default RenderFile;
