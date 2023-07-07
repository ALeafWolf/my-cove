import { NextPage } from "next";
import { GetServerSideProps } from "next";
import {
  get,
  isoToDate,
  getPostThumbnailUrl,
  parseToSingleArray,
} from "@/utils/functions";
import { Post, Collection } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

interface Props {
  posts: Post[];
  categories: string[];
  tags: string[];
}

const Search: NextPage<Props> = ({ posts, categories, tags }) => {
  return (
    <div>
      <Head>
        <title>搜索结果 | My Cove</title>
      </Head>
      <div>
        <h1>搜索结果</h1>
        <div className="flex gap-2">
          {categories?.map((category) => (
            <h3 key={category}>{category}</h3>
          ))}
        </div>
        <div className="flex gap-2">
          {tags?.map((tag) => (
            <h3 key={tag}>{tag}</h3>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {posts ? (
          posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="block">
              <div className="post-card-img-container">
                {getPostThumbnailUrl(post) && (
                  <Image
                    className="img-cover"
                    src={getPostThumbnailUrl(post) || ""}
                    alt={post.attributes.title}
                    width={400}
                    height={300}
                  />
                )}
              </div>
              <div className="p-2">
                <h4>{post.attributes.title}</h4>
                <p>{post.attributes.summary}</p>
                <div>
                  <p className="text-gray-500 text-right">
                    {isoToDate(post.attributes.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>无对应的界面</div>
        )}
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // force in array form
  const categories = parseToSingleArray(ctx.query?.category);
  const tags = parseToSingleArray(ctx.query?.tag);
  console.log(`categories: ${categories}\ntags: ${tags}`);
  let filters: any = {};
  if (categories) {
    filters.categories = {
      name: {
        $in: categories,
      },
    };
  }
  if (tags) {
    filters.tags = {
      name: {
        $in: tags,
      },
    };
  }
  const { data } = await get(`/posts`, {
    params: {
      filters: filters,
      populate: {
        thumbnail: {
          fields: "url",
        },
        categories: {
          fields: "name",
        },
        tags: {
          fields: "name",
        },
        collection: {
          fields: "name",
          populate: {
            header_image: {
              fields: "url",
            },
          },
        },
      },
      sort: ["id:desc"],
    },
  });

  return {
    props: {
      posts: data.data,
      categories,
      tags,
    },
  };
};
export default Search;
