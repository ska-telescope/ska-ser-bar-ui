## SKA Binary Artefacts Repository UI

The ska-ser-bar-ui is a web application designed to provide a user-friendly interface for managing binary artefacts in the SKAO Binary Artefacts Repository. The UI enables users to efficiently interact with the repository, offering features such as:
- Search & Browse: Find artefacts quickly using a responsive search with filtering options.
- Download Artefacts: Retrieve specific artefacts, including different versions, with an intuitive interface.
- Upload & Manage: Securely upload new artefacts, attach metadata, and ensure proper versioning.

The application integrates seamlessly with the SKAO artefact repository via its [REST API](https://gitlab.com/ska-telescope/sdi/ska-cicd-automation/-/tree/master/src/ska_cicd_automation/plugins/binary_artefacts), providing an optimized and streamlined experience for developers and operators.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can start editing by modifying the code inside `src/app/`. The page auto-updates as you edit the files. 

In order to have the application fully working you need to be able to make calls to the REST API as well as define some environment variables.

Create `.env` at the root of the repository with:
```
BINARY_GITLAB_CLIENT_ID= <your personal gitlab application ID>
BINARY_GITLAB_CLIENT_SECRET= <your personal gitlab application secret>
NEXTAUTH_SECRET= <generate a local random one>
REST_API_TOKEN_HEADER= <token header for the BAR REST API, not required if you run the API locally without authentication>
REST_API_TOKEN_SECRET= <token secret for the BAR REST API, not required if you run the API locally without authentication>
REST_API_URL= <"http://localhost:8000" if you run the API locally>
```
To run the BAR REST API locally, please refer to documentation on [ska-cicd-automation](https://gitlab.com/ska-telescope/sdi/ska-cicd-automation).

## Structure
```console
.
├── charts
│   └── ...
├── public
│   └── ...
├── src
|   ├── middleware.ts
│   └── app
|       └── api
|       ├── artefacts
|       ├── components
|       ├── actions.ts
|       ├── page.tsx
|       └── ...
├── Dockerfile
├── LICENSE
├── Makefile
└── README.md
└── ...
```
- **src/middleware.ts**
    - Responsible for redirecting traffic to the REST API. Client-side only requests the UI server and never the actual BAR REST API.
- **src/app/api**
    - Required to handle sign in with Gitlab through `next-auth`.
- **src/app/artefacts**
    - Main page after logging in. Responsible for displaying, searching, download and sorting artefacts.
- **src/app/components**
    - All the components that will then be imported by the main views.
- **src/app/actions.ts**
    - Functions to make API calls.
- **src/app/page.tsx**
    - Landing page where the user logs in.

## Deploy the application

First build the docker image:
```
make oci-build
```

Now create a local_values.yaml in your root folder:

```
config:
  restApi:
    service: binary-artefacts-app-ska-cicd-automation
    namespace: bar-dev
  secrets:
    data:
      binary_gitlab_client_id= <your personal gitlab application id>
      binary_gitlab_client_secret= <your personal gitlab application secret>
      nextauth_secret= <generate a local random one>
      rest_api_token_header= <token header for the bar rest api, not required if you run the api locally without authentication>
      rest_api_token_secret= <token secret for the bar rest api, not required if you run the api locally without authentication>
  host: dev.binary.artefact.skao.int

image:
  repository: ska-ser-bar-ui
  pullPolicy: IfNotPresent
  tag: <tag generate by make oci-build>
```

then run:
```
helm upgrade --install -f local_values.yaml -n bar-dev --create-namespace bar-dev charts/ska-ser-bar-ui
```
