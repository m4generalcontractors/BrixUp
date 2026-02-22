# Transaction Categorization

## Purpose
Accurately categorize all financial transactions across every M4 Development Holdings LLC entity. Ensure proper cost coding, entity allocation, and synchronization with QuickBooks for clean financial records and reporting.

## M4 Entity Chart of Accounts
Each entity maintains a separate QuickBooks company file:
- **M4 Development Holdings LLC** - Parent holding company
- **M4 General Contractors** - General contracting operations
- **Overland Grading & Sitework** - Sitework and earthwork operations
- **M4 Aggregates** - Materials supply operations
- **NexGen Capital Partners** - Real estate investment fund
- **Southern View Homes** - Residential construction
- **BrixUp Technologies** - Technology operations

## Transaction Categorization Workflow

### Step 1: Transaction Ingestion
- Pull uncategorized transactions from all connected bank accounts and credit cards daily.
- Import Stripe payment transactions for any digital payment processing.
- Identify the originating entity based on the bank account or card used.
- Flag any transactions that appear in one entity's account but may belong to another (inter-company).

### Step 2: Categorization Rules
- Apply automated categorization rules for recurring vendors and transaction patterns.
- Categorize by account type: Revenue, Cost of Goods Sold, Operating Expense, Asset, Liability, or Equity.
- For construction entities (M4 GC, Overland, Southern View), assign both an expense account and a project job code.
- For M4 Aggregates, categorize by material type: aggregate, sand, gravel, trucking.
- For NexGen Capital Partners, categorize by fund and investment property.
- For BrixUp Technologies, categorize by department: Development, Infrastructure, Operations.

### Step 3: Project and Job Costing
- Every transaction for M4 GC, Overland, and Southern View must be assigned to a specific project/job.
- Apply the CSI cost code to each project-related expense for budget tracking alignment.
- Overhead and general conditions costs must be properly allocated across active projects per the allocation methodology.
- Equipment costs for Overland are allocated based on equipment hours logged per project.

### Step 4: Inter-Company Transactions
- Identify and properly code inter-company transactions (e.g., Overland performing work for M4 GC).
- Create matching entries in both entity QuickBooks files: receivable in the performing entity and payable in the receiving entity.
- M4 Aggregates material sales to M4 GC or Overland projects must be coded as inter-company revenue/expense.
- Reconcile inter-company balances monthly to ensure they net to zero at the holding company level.

### Step 5: QuickBooks Sync and Validation
- Sync categorized transactions to the appropriate QuickBooks company file.
- Validate that all transactions have: date, vendor/payee, amount, account, entity, and project (if applicable).
- Run a daily exception report for any transactions missing required categorization fields.
- Reconcile bank statement balances with QuickBooks balances weekly.

## Categorization Standards
- Use the M4 standard chart of accounts consistently across all entities.
- Materials purchases over $500 must include a purchase order reference.
- Credit card transactions must have receipt documentation attached.
- Transactions over $10,000 require manager review before final categorization.

## Monthly Procedures
- Complete all transaction categorization by the 3rd business day of the following month.
- Resolve all flagged exceptions by the 5th business day.
- Produce a categorization accuracy report showing: total transactions, auto-categorized, manually categorized, and exceptions.
- Feed categorized data into the financial reporting workflow for entity-level financial statement preparation.
