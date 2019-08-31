import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { VTUBERS } from "@holostats/libs/const";

const defaultVTubers =
  "aki,aqua,ayame,azki,choco,flare,fubuki,haato,hololive,korone,marine,matsuri,mel,miko,mio,nana,noel,okayu,pekora,roboco,rushia,shion,sora,subaru,suisei,ui";

@Injectable({ providedIn: "root" })
export class ConfigService {
  allVTuberIds = VTUBERS.map(v => v.id);

  private subscribeIdsSource = new BehaviorSubject<string[]>(
    (localStorage.getItem("holostats:selectedVTubers") || defaultVTubers)
      .split(",")
      .filter(id => this.allVTuberIds.includes(id))
      .filter((id, i, ids) => ids.indexOf(id) === i)
  );

  private enableDarkModeSource = new BehaviorSubject<boolean>(
    localStorage.getItem("holostats:enableDarkMode") !== null
  );

  subscribeIds$ = this.subscribeIdsSource.asObservable();
  enableDarkMode$ = this.enableDarkModeSource.asObservable();

  setSubscribeIds(ids: string[]) {
    let filteredIds = ids
      .filter(id => this.allVTuberIds.includes(id))
      .filter((id, i, ids) => ids.indexOf(id) === i);
    localStorage.setItem("holostats:selectedVTubers", filteredIds.join(","));
    this.subscribeIdsSource.next(ids);
  }

  getSubscribeIds(): string[] {
    return this.subscribeIdsSource.value;
  }

  toggleDarkMode() {
    if (this.enableDarkModeSource.value) {
      this.enableDarkModeSource.next(false);
      localStorage.removeItem("holostats:enableDarkMode");
      document.body.classList.remove("dark");
    } else {
      this.enableDarkModeSource.next(true);
      localStorage.setItem("holostats:enableDarkMode", "t");
      document.body.classList.add("dark");
    }
  }
}
