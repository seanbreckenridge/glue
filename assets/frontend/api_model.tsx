import { Context, setContextFunc } from "./app_provider";

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
  at: number;
}

interface PageHits {
  count: number;
}

type GuestBookComments = GuestBookComment[];

// result (Value|Err) types
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
  await fetch("/api/page_hit", { method: "POST" }).catch((e: Error) => {
    console.error(e);
    return e;
  });
};

export {
  CubingData,
  PageHits,
  RPageHits,
  RCubingData,
  RGuestBookComments,
  requestAndSetCubing,
  requestAndSetComments,
  requestAndSetPageHits,
  sendPageHit,
  CubingRecords,
  GuestBookComment,
  GuestBookComments,
};
