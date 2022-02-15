import type { NextPage } from "next";
const axios = require("axios");
const jsdom = require("jsdom");
import Head from "next/head";
import { GetStaticProps } from "next";

import styles from "../styles/Home.module.css";
import BookCard from "../components/BookCard";

const { JSDOM } = jsdom;

type Book = {
  title: string;
  author: string;
  type: string;
  discount_price: string;
  real_price: string;
  num_reviews: string;
  image_url: string;
  index: number;
};

type Props = {
  books: Book[];
};

const Home: NextPage<Props> = ({ books }: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Top 20 Book List</title>
        <meta name="description" content="Amazon Top 20 Book List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl text-center font-normal my-10">
        Amazon Top 20 Book List
      </h1>
      <div className="grid grid-cols-4 gap-3 justify-items-center mx-40  shadow-xl shadow-slate-200 py-10 my-10">
      {books.map((book) => {
        return (
          <BookCard key={book.title} {...book} />
        );
      })}
      </div>
    </div>
  );
};

function containsAlphaNumeric(str: string) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (
      (code > 47 && code < 58) ||
      (code > 64 && code < 91) ||
      (code > 96 && code < 123)
    )
      return true;
  }
  return false;
}

function createBookObj(text_scrape: string[], book_img_url: string, index: number) {
  let book_obj = {};
  book_obj = {
    index: index+1,
    title: text_scrape[0],
    author: text_scrape[1],
    type: text_scrape[2],
    discount_price: text_scrape[3].substring(0, 6),
    real_price: text_scrape[4].substring(0, 6),
    num_reviews: text_scrape[5].substring(1, text_scrape[5].length - 1),
    image_url: book_img_url,
  };
  return book_obj;
}

function bookScraping(dom: any) {
  let text_from_book: string[];
  let book_img_url: string;
  let text_scrape: string[];
  let book_array: Array<{}> = [];

  for (let x = 0; x < 20; x++) {
    text_from_book = dom.window.document
      .getElementById(`acs-product-block-${x}`)
      .textContent.split("\n");
    book_img_url = dom.window.document
      .getElementById(`acs-product-block-${x}`)
      .children.item(0)
      .children.item(0)
      .children.item(1).src;
    text_scrape = text_from_book.filter((text_from_book: string) =>
      containsAlphaNumeric(text_from_book)
    );
    text_scrape.forEach((text_scrape_item, index) => {
      text_scrape[index] = text_scrape_item.trim(); //Remove unnecessary spaces
    });
    book_array.push(createBookObj(text_scrape, book_img_url, x));
  }

  return book_array;
}

export const getStaticProps: GetStaticProps = async () => {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  let res = { data: "" };
  let book_array: Array<{}> = [];
  try {
    res = await axios.get("https://www.amazon.com/b?ie=UTF8&node=17296221011"); // Amazon Top 100 URL
    let dom = new JSDOM(res.data);
    book_array = bookScraping(dom); //Returns a JSON Array of the Top 20 Books
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      books: book_array,
    },
    revalidate: 43200 //Revalidate the data every 24 hours (keeps our Top 20 List accurate and inline with Amazons List)
  };
};

export default Home;
