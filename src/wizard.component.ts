import { Component, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, Input } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';

@Component({
  selector: 'form-wizard',
  template:
  `<div class="pageContent">
      <ul class="nav nav-pills nav-justified wizard">
        <li class="nav-item" *ngFor="let step of steps" [ngClass]="{'active': step.isActive, 'enabled': !step.isDisabled, 'disabled': step.isDisabled, 'completed': isCompleted}">
        <span class="nav-link">{{step.title}}</span>
        </li>
      </ul>
    <div class="sectionContainer">
      <ng-content></ng-content>
    </div>
    <div class="pageActions" [hidden]="isCompleted">
        <button type="button" class="btn btn-secondary float-left" (click)="previous()" [hidden]="!hasPrevStep || !activeStep.showPrev">{{previousBtnText}}</button>
        <button type="button" class="btn btn-primary float-right" (click)="next()" [disabled]="!activeStep.isValid" [hidden]="!hasNextStep || !activeStep.showNext">{{nextBtnText}}</button>
        <button type="button" class="btn btn-primary float-right" (click)="complete()" [disabled]="!activeStep.isValid" [hidden]="hasNextStep">{{doneBtnText}}</button>
    </div>
  </div>`
  ,
  styles: [
  ]
})
export class WizardComponent implements AfterContentInit {
  @Input() doneBtnText='Done';
  @Input() nextBtnText='Next';
  @Input() previousBtnText='Previous';
  @ContentChildren(WizardStepComponent)
  wizardSteps: QueryList<WizardStepComponent>;

  private _steps: Array<WizardStepComponent> = [];
  private _isCompleted: boolean = false;

  @Output()
  onStepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();

  constructor() { }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this.steps[0].isActive = true;
  }

  get steps(): Array<WizardStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get activeStep(): WizardStepComponent {
    return this.steps.find(step => step.isActive);
  }

  set activeStep(step: WizardStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onStepChanged.emit(step);
    }
  }

  public get activeStepIndex(): number {
    return this.steps.indexOf(this.activeStep);
  }

  get hasNextStep(): boolean {
    return this.activeStepIndex < this.steps.length - 1;
  }

  get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  public goToStep(step: WizardStepComponent): void {
    if (!this.isCompleted) {
      this.activeStep = step;
    }
  }

  public next(): void {
    if (this.hasNextStep) {
      let nextStep: WizardStepComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  }

  public previous(): void {
    if (this.hasPrevStep) {
      let prevStep: WizardStepComponent = this.steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
    }
  }

  public complete(): void {
    this.activeStep.onComplete.emit();
    this._isCompleted = true;
  }

}
