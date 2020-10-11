import React from "react";
import {Context, AppContextConsumer} from "../../app_provider";
import {CubingData, CubingRecords} from "../../api_model";
import WrapApiError from "../components/wrap_api_error";
import {setWindowMsg} from "./home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import {fullScreenDialogScale, launchWindowFunc} from "./actions";

const minHeight = 500;
const minWidth = 350;

export function CubingWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const {browserWidth, browserHeight} = getWindowDimensions();
    const {x, y} = jitterCenterLocation();
    const cubingDialogWidth = browserWidth * fullScreenDialogScale;
    const cubingDialogHeight = browserHeight * fullScreenDialogScale;
    const windowId = Date.now().toString();
    const cubingDialog = (
      <>
        <Dialog
          x={Math.max(x - minWidth, x - cubingDialogWidth / 2)}
          y={y - (cubingDialogHeight / 2) - (minHeight / 5)}
          width={cubingDialogWidth}
          height={cubingDialogHeight}
          title="cubing"
          // when close it hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({spawn: false, windowId: windowId})}
        >
          <Cubing />
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: cubingDialog,
    });
  };
}

export default function Cubing() {
  return (
    <>
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <WrapApiError data={value.cubing}>
              <div className="cubing-body">
                <CubingBody data={value.cubing! as CubingData} />
              </div>
            </WrapApiError>
          );
        }}
      </AppContextConsumer>
    </>
  );
}

interface ICubingBody {
  data: CubingData;
}

const CubingBody = ({data}: ICubingBody) => {
  return (
    <>
      <p>These are <a href="https://www.worldcubeassociation.org/persons/2017BREC02">my records</a> from <a href="https://worldcubeassosiation.org">WCA</a> (World Cube Association) approved competitions. I've been to {data.competitions} competitions and have {data.completed_solves}completed official solves.</p>
      <p>For those unfamiliar with the notation, a Single is the time for a single solve, and an Average is the average of the 3 middle solves of a set of 5 consecutive solves. As an example, if you had 5 solves like: '(40.20) 30.54 28.39 (25.40) 32.50', the average would be '(30.54 + 28.39 + 32.50) / 3'.</p>
      <p>NR specifies a my ranking nationally and WR specifies my ranking globally.</p>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>Name</th>
            <th colSpan={3}>Single</th>
            <th colSpan={3}>Average</th>
          </tr>
          <tr>
            <th>Time</th>
            <th>NR</th>
            <th>WR</th>
            <th>Time</th>
            <th>NR</th>
            <th>WR</th>
          </tr>
        </thead>
        <tbody>
          {data.events.map((cubingEvent: CubingRecords) => {
            return (<tr key={cubingEvent.name}>
              <td>{cubingEvent.name}</td>
              <td>{cubingEvent.single.time}</td>
              <td>{cubingEvent.single.national}</td>
              <td>{cubingEvent.single.world}</td>
              <td>{cubingEvent.average.time}</td>
              <td>{cubingEvent.average.national}</td>
              <td>{cubingEvent.average.world}</td>
            </tr>
            )
          })}
        </tbody>
      </table>
      <p>Only hardware I really care about is my 3x3, which is a <a href="https://www.thecubicle.com/products/moyu-weilong-gts3-m">Moyu GTS3M</a>. For a lot of my other puzzles I just bought whatever the standard mid-range cubes are.</p>
      <p>For competition, I use full <a href="https://www.speedsolving.com/wiki/index.php/CFOP_method">CFOP</a> with some <a href="https://www.speedsolving.com/wiki/index.php/COLL">COLL</a> for 3x3, <a href="https://www.speedsolving.com/wiki/index.php/Yau_method">Yau</a> for 4x4, and <a href="https://www.speedsolving.com/wiki/index.php/Ortega_Method">Ortega</a> for 2x2. For other events I'm only familiar with the basics. I've played around with <a href="https://www.speedsolving.com/wiki/index.php/Roux_method">Roux</a> (~average around 40 seconds), currently use 2-look <a href="https://www.speedsolving.com/wiki/index.php/CMLL">CMLL</a>.</p>
    </>
  )
}
