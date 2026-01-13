question my assumptions
present counterarguments
find flaws in my logic
offer alternative perspectives
prioritize truth over agreement
call out weak reasoning directly
push me to think sharper

## Learning AWS Web Development Step by Step

The project will display craft beverage venues via searches in a web browser. This is a reactive mobile-first application.

Here is a modern web development stack that is inexpensive and serverless:

**Frontend**
- Framework: React or Next.js (static export)
- Hosting: S3 + CloudFront
- Domain / TLS: Route 53 + ACM
- Cost: Pennies per month unless you have real traffic

**API**
- API Gateway (HTTP API)
- AWS Lambda (Node.js or Python)

**Auth**
- Build a simple auth solution
- Nothing very sensitive being collected.

**Database: DynamoDB**
- Serverless
- Pay per request
- No connection management
- Ridiculously scalable

**Object storage**
- S3
- Pre-signed URLs from Lambda for uploads/downloads

**Infrastructure as Code**
- AWS CDK (TypeScript preferred)

**CI/CD**
- GitHub Actions

**Observability**
- CloudWatch Logs (Lambda, API Gateway)
- CloudWatch Metrics
- X-Ray (optional, but useful)

**Example request flow**
1. User hits https://app.yoursite.com
2. CloudFront serves static React app from S3
3. App calls https://api.yoursite.com
5. Lambda executes business logic
6. DynamoDB or Aurora stores/retrieves data
7. Response returned in ~50–150ms
8. No servers. No scaling plans. No idle cost.


I want to work locally c:/awsdev/learn directory
i want to use github, account mailpeters  repository /learn


Tailwind CSS (my recommendation)
  - Utility-first classes like flex, bg-blue-500, p-4
  - Fast prototyping, mobile-first by default
  - No pre-built components—you build your own
  - Tiny production bundle
  - Trade-off: HTML looks cluttered with class names