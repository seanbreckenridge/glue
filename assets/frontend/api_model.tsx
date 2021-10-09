import { Context, setContextFunc } from "./app_provider";
import { requestFeedCount } from "./data";

// individual feed items
interface FeedItem {
  image_url?: string;
  site_url: string;
  timestamp: string;
  title: string;
  type: string;
}

type FeedData = FeedItem[];

interface CubingData {
  completed_solves: number;
  competitions: number;
  wca_id: string;
  gender: string;
  events: CubingRecords[];
}

// both single and average times for one event
interface CubingRecords {
  name: string;
  single: CubingTimes;
  average: CubingTimes;
}

// times for one type (single/average)
interface CubingTimes {
  time: string;
  national: string;
  continent: string;
  world: string;
}

interface GuestBookComment {
  id: number;
  name: string;
  comment: string;
  at: string;
}

interface PageHits {
  count: number;
}

type GuestBookComments = GuestBookComment[];

// result (Value|Err) types
type RFeedData = Result<FeedData>;
type RCubingData = Result<CubingData>;
type RGuestBookComments = Result<GuestBookComments>;
type RPageHits = Result<PageHits>;

async function loadInterfaceMatches<T>(url: string): Promise<Result<T>> {
  return await fetch(url)
    .then((resp: Response) => resp.json())
    .then((resp_json: Object) => resp_json as T)
    .catch((e: Error) => {
      console.error(e);
      return e;
    });
}

// request and set feed data
const requestAndSetFeed = async (setData: setContextFunc) => {
  loadInterfaceMatches<FeedData>(
    `/api/data/feed?count=${requestFeedCount}&format_dates`
  ).then((response: RFeedData) => {
    setData((oldData: Context): Context => {
      return {
        ...oldData,
        feed: response,
      };
    });
  });
};

// request and set cubing data
const requestAndSetCubing = async (setData: setContextFunc) => {
  loadInterfaceMatches<CubingData>("/api/data/cubing").then(
    (response: RCubingData) => {
      setData((oldData: Context): Context => {
        return {
          ...oldData,
          cubing: response,
        };
      });
    }
  );
};

// request and set guestbook comments data
const requestAndSetComments = async (setData: setContextFunc) => {
  loadInterfaceMatches<GuestBookComments>("/api/gb_comment").then(
    (response: RGuestBookComments) => {
      setData((oldData: Context): Context => {
        return {
          ...oldData,
          comments: response,
        };
      });
    }
  );
};

// request and set page hits
const requestAndSetPageHits = async (setData: setContextFunc) => {
  loadInterfaceMatches<PageHits>("/api/page_hit").then(
    (response: RPageHits) => {
      setData((oldData: Context): Context => {
        return {
          ...oldData,
          pageHits: response,
        };
      });
    }
  );
};

const sendPageHit = async () => {
  await fetch("/api/page_hit", { method: "POST" })
    .catch((e: Error) => {
      console.error(e);
      return e;
    });
};

export {
  FeedItem,
  FeedData,
  CubingData,
  PageHits,
  RPageHits,
  RFeedData,
  RCubingData,
  RGuestBookComments,
  requestAndSetCubing,
  requestAndSetFeed,
  requestAndSetComments,
  requestAndSetPageHits,
  sendPageHit,
  CubingRecords,
  GuestBookComment,
  GuestBookComments,
};
