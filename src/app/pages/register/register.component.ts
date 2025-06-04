import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Select } from 'primeng/select';
import { BranchesService } from '../../core/services/branches/branches.service';
import { AttachmentButtonComponent } from '../../shared/components/ui/attachment-button/attachment-button.component';
import { LanguageButtonComponent } from '../../shared/components/ui/language-button/language-button.component';
import { IBranches } from '../../shared/interfaces/ibranches';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    LanguageButtonComponent,
    Select,
    AttachmentButtonComponent,
  ],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly branchesService = inject(BranchesService);
  readonly translateService = inject(TranslateService);
  branches: IBranches[] = [];
  branchFormGroup!: FormGroup;

  constructor() {
    this.initBranchForm();
  }

  ngOnInit(): void {
    this.getAllBranches();
  }

  // initalize the form by using formGroup
  initBranchForm(): void {
    this.branchFormGroup = new FormGroup({
      selectedBranches: new FormControl<IBranches | null>(null),
    });
  }

  // handle branch services to get Data...
  getAllBranches() {
    this.branchesService.getBranches().subscribe({
      next: (res) => {
        this.branches = res.result;
        console.log(this.branches);
        // [{}, {}];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
