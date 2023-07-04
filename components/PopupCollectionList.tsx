import { Collection, Post } from "@/utils/types";
import { FunctionComponent } from "react";
import Image from "next/image";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
  collection: Collection;
  setPopup: (bool: boolean) => void;
  currentPostId: number;
}

const Popup: FunctionComponent<Props> = ({
  collection,
  setPopup,
  currentPostId,
}) => {
  return (
    <div className="">
      <div className="collection-popup p-4 pt-10 bg-slate-600 relative">
        <button className="absolute right-4 top-2">
          <FontAwesomeIcon icon={faXmark} onClick={() => setPopup(false)} size="xl"/>
        </button>
        <Image
          className="w-full"
          src={collection.attributes.header_image.data.attributes.url}
          alt={collection.attributes.title}
          width={400}
          height={250}
        />
        <h3 className="text-center">{collection.attributes.title}</h3>
        <ol>
          {collection.attributes.posts.data.map((post: Post) => (
            <li key={post.id}>
              {post.id === currentPostId ? (
                <p
                  className={post.id === currentPostId ? "text-green-500" : ""}
                >
                  {post.attributes.title}
                </p>
              ) : (
                <a href={`/post/${post.id}`}>{post.attributes.title}</a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Popup;
