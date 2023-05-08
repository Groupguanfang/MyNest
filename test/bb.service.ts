import { Injectable } from "../src/main";
import { CService } from "./cc.service";

@Injectable
export class BService {
  constructor(private readonly cService: CService) {}
  public getText() {
    return this.cService.getText();
  }
}
