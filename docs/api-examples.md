# Captured API output

Everything below is verbatim output from a running instance: Strapi 4.1.8 on Node
16.20.2, SQLite, seeded by `SEED_ON_BOOTSTRAP=true`, listening on port 8270. Nothing
here is hand-written — regenerate it by booting the CMS and re-running the commands.

The one edit is to the depth-limit response, where the development-mode stack trace has
been dropped and only the error kept.

---

## `GET /api/home-page`

The deliverable the challenge brief asks for: 1 Header Block, 2 Two-Column Blocks and a
Carousel Block with three items, each with its media populated.

The `sections` dynamic zone is populated by default — see
`src/api/home-page/services/home-page.js`. Stock Strapi would return the entry with no
`sections` at all.

```console
$ curl -s http://localhost:8270/api/home-page | python3 -m json.tool
```

```json
{
    "data": {
        "id": 1,
        "attributes": {
            "createdAt": "2026-09-23T14:37:37.581Z",
            "updatedAt": "2026-09-23T14:37:37.581Z",
            "publishedAt": "2026-09-23T14:37:37.568Z",
            "sections": [
                {
                    "id": 1,
                    "__component": "common.header",
                    "Text": "Surgical video, peer reviewed.",
                    "ButtonText": "Browse the library",
                    "ButtonLink": "/library"
                },
                {
                    "id": 1,
                    "__component": "common.two-column-block",
                    "TitleText": "Filmed in theatre, narrated by the operating surgeon",
                    "Description": "Every article on JOMI is a full-length operation recorded from the surgeon\u2019s point of view, with the surgeon narrating the decisions as they are made \u2014 why this plane, why this instrument, what to do when the anatomy is not what the textbook promised.",
                    "ButtonText": "Watch a sample operation",
                    "ButtonUrl": "/library/laparoscopic-cholecystectomy",
                    "ImagePosition": "Right",
                    "Image": {
                        "data": {
                            "id": 1,
                            "attributes": {
                                "name": "operating-room.png",
                                "alternativeText": "Surgeons operating under theatre lights",
                                "caption": "Every procedure is filmed from the surgeon\u2019s point of view.",
                                "width": 900,
                                "height": 600,
                                "formats": {
                                    "thumbnail": {
                                        "name": "thumbnail_operating-room.png",
                                        "hash": "thumbnail_operating_room_aaf3f8a8c7",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "path": null,
                                        "width": 234,
                                        "height": 156,
                                        "size": 42.44,
                                        "url": "/uploads/thumbnail_operating_room_aaf3f8a8c7.png"
                                    },
                                    "medium": {
                                        "name": "medium_operating-room.png",
                                        "hash": "medium_operating_room_aaf3f8a8c7",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "path": null,
                                        "width": 750,
                                        "height": 500,
                                        "size": 440.33,
                                        "url": "/uploads/medium_operating_room_aaf3f8a8c7.png"
                                    },
                                    "small": {
                                        "name": "small_operating-room.png",
                                        "hash": "small_operating_room_aaf3f8a8c7",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "path": null,
                                        "width": 500,
                                        "height": 333,
                                        "size": 182.06,
                                        "url": "/uploads/small_operating_room_aaf3f8a8c7.png"
                                    }
                                },
                                "hash": "operating_room_aaf3f8a8c7",
                                "ext": ".png",
                                "mime": "image/png",
                                "size": 102.59,
                                "url": "/uploads/operating_room_aaf3f8a8c7.png",
                                "previewUrl": null,
                                "provider": "local",
                                "provider_metadata": null,
                                "createdAt": "2026-09-23T14:37:37.093Z",
                                "updatedAt": "2026-09-23T14:37:37.093Z"
                            }
                        }
                    }
                },
                {
                    "id": 2,
                    "__component": "common.two-column-block",
                    "TitleText": "Reviewed by surgeons before it is published",
                    "Description": "Each submission is reviewed by practising surgeons in the same speciality. Reviewers annotate the video itself rather than a manuscript about it, so the critique lands on the step it refers to and readers can see exactly what was questioned.",
                    "ButtonText": "How peer review works",
                    "ButtonUrl": "/about/peer-review",
                    "ImagePosition": "Left",
                    "Image": {
                        "data": {
                            "id": 2,
                            "attributes": {
                                "name": "peer-review.png",
                                "alternativeText": "A reviewer annotating a surgical video timeline",
                                "caption": "Each article is peer reviewed before publication.",
                                "width": 900,
                                "height": 600,
                                "formats": {
                                    "thumbnail": {
                                        "name": "thumbnail_peer-review.png",
                                        "hash": "thumbnail_peer_review_438150eeca",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "path": null,
                                        "width": 234,
                                        "height": 156,
                                        "size": 38.09,
                                        "url": "/uploads/thumbnail_peer_review_438150eeca.png"
                                    },
                                    "medium": {
                                        "name": "medium_peer-review.png",
                                        "hash": "medium_peer_review_438150eeca",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "path": null,
                                        "width": 750,
                                        "height": 500,
                                        "size": 421.82,
                                        "url": "/uploads/medium_peer_review_438150eeca.png"
                                    },
                                    "small": {
                                        "name": "small_peer-review.png",
                                        "hash": "small_peer_review_438150eeca",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "path": null,
                                        "width": 500,
                                        "height": 333,
                                        "size": 170.55,
                                        "url": "/uploads/small_peer_review_438150eeca.png"
                                    }
                                },
                                "hash": "peer_review_438150eeca",
                                "ext": ".png",
                                "mime": "image/png",
                                "size": 98.96,
                                "url": "/uploads/peer_review_438150eeca.png",
                                "previewUrl": null,
                                "provider": "local",
                                "provider_metadata": null,
                                "createdAt": "2026-09-23T14:37:37.210Z",
                                "updatedAt": "2026-09-23T14:37:37.210Z"
                            }
                        }
                    }
                },
                {
                    "id": 1,
                    "__component": "common.carousel",
                    "Item": [
                        {
                            "id": 3,
                            "TitleText": "Laparoscopic cholecystectomy",
                            "Description": "Critical view of safety demonstrated in full, including the dissection that establishes it and the point at which the surgeon would convert.",
                            "ButtonText": "Open the article",
                            "ButtonUrl": "/library/laparoscopic-cholecystectomy",
                            "ImagePosition": "Left",
                            "Image": {
                                "data": {
                                    "id": 3,
                                    "attributes": {
                                        "name": "laparoscopy.png",
                                        "alternativeText": "Laparoscopic instruments inside the abdominal cavity",
                                        "caption": "Laparoscopic cholecystectomy, step by step.",
                                        "width": 900,
                                        "height": 600,
                                        "formats": {
                                            "thumbnail": {
                                                "name": "thumbnail_laparoscopy.png",
                                                "hash": "thumbnail_laparoscopy_a06c9167e3",
                                                "ext": ".png",
                                                "mime": "image/png",
                                                "path": null,
                                                "width": 234,
                                                "height": 156,
                                                "size": 41.09,
                                                "url": "/uploads/thumbnail_laparoscopy_a06c9167e3.png"
                                            },
                                            "medium": {
                                                "name": "medium_laparoscopy.png",
                                                "hash": "medium_laparoscopy_a06c9167e3",
                                                "ext": ".png",
                                                "mime": "image/png",
                                                "path": null,
                                                "width": 750,
                                                "height": 500,
                                                "size": 445.13,
                                                "url": "/uploads/medium_laparoscopy_a06c9167e3.png"
                                            },
                                            "small": {
                                                "name": "small_laparoscopy.png",
                                                "hash": "small_laparoscopy_a06c9167e3",
                                                "ext": ".png",
                                                "mime": "image/png",
                                                "path": null,
                                                "width": 500,
                                                "height": 333,
                                                "size": 184.11,
                                                "url": "/uploads/small_laparoscopy_a06c9167e3.png"
                                            }
                                        },
                                        "hash": "laparoscopy_a06c9167e3",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "size": 99.33,
                                        "url": "/uploads/laparoscopy_a06c9167e3.png",
                                        "previewUrl": null,
                                        "provider": "local",
                                        "provider_metadata": null,
                                        "createdAt": "2026-09-23T14:37:37.324Z",
                                        "updatedAt": "2026-09-23T14:37:37.324Z"
                                    }
                                }
                            }
                        },
                        {
                            "id": 4,
                            "TitleText": "Knee arthroscopy with meniscal repair",
                            "Description": "Portal placement, diagnostic sweep and an inside-out repair, with the surgeon explaining when a tear is worth repairing rather than trimming.",
                            "ButtonText": "Open the article",
                            "ButtonUrl": "/library/knee-arthroscopy",
                            "ImagePosition": "Right",
                            "Image": {
                                "data": {
                                    "id": 4,
                                    "attributes": {
                                        "name": "orthopedics.png",
                                        "alternativeText": "An orthopaedic surgeon preparing a knee arthroscopy",
                                        "caption": "Knee arthroscopy with portal placement annotated.",
                                        "width": 900,
                                        "height": 600,
                                        "formats": {
                                            "thumbnail": {
                                                "name": "thumbnail_orthopedics.png",
                                                "hash": "thumbnail_orthopedics_cbe5aec8f4",
                                                "ext": ".png",
                                                "mime": "image/png",
                                                "path": null,
                                                "width": 234,
                                                "height": 156,
                                                "size": 40.94,
                                                "url": "/uploads/thumbnail_orthopedics_cbe5aec8f4.png"
                                            },
                                            "medium": {
                                                "name": "medium_orthopedics.png",
                                                "hash": "medium_orthopedics_cbe5aec8f4",
                                                "ext": ".png",
                                                "mime": "image/png",
                                                "path": null,
                                                "width": 750,
                                                "height": 500,
                                                "size": 442.25,
                                                "url": "/uploads/medium_orthopedics_cbe5aec8f4.png"
                                            },
                                            "small": {
                                                "name": "small_orthopedics.png",
                                                "hash": "small_orthopedics_cbe5aec8f4",
                                                "ext": ".png",
                                                "mime": "image/png",
                                                "path": null,
                                                "width": 500,
                                                "height": 333,
                                                "size": 182.55,
                                                "url": "/uploads/small_orthopedics_cbe5aec8f4.png"
                                            }
                                        },
                                        "hash": "orthopedics_cbe5aec8f4",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "size": 98.92,
                                        "url": "/uploads/orthopedics_cbe5aec8f4.png",
                                        "previewUrl": null,
                                        "provider": "local",
                                        "provider_metadata": null,
                                        "createdAt": "2026-09-23T14:37:37.444Z",
                                        "updatedAt": "2026-09-23T14:37:37.444Z"
                                    }
                                }
                            }
                        },
                        {
                            "id": 5,
                            "TitleText": "Teaching files for residents",
                            "Description": "Programmes use JOMI to prepare residents for cases they are about to scrub on: watch the operation, read the review, then step into theatre.",
                            "ButtonText": "For institutions",
                            "ButtonUrl": "/institutions",
                            "ImagePosition": "Left",
                            "Image": {
                                "data": {
                                    "id": 5,
                                    "attributes": {
                                        "name": "teaching.png",
                                        "alternativeText": "Residents reviewing an operation on a wall display",
                                        "caption": "Residents prepare for theatre by watching the case first.",
                                        "width": 900,
                                        "height": 600,
                                        "formats": {
                                            "thumbnail": {
                                                "name": "thumbnail_teaching.png",
                                                "hash": "thumbnail_teaching_53757a63aa",
                                                "ext": ".png",
                                                "mime": "image/png",
                                                "path": null,
                                                "width": 234,
                                                "height": 156,
                                                "size": 42.59,
                                                "url": "/uploads/thumbnail_teaching_53757a63aa.png"
                                            },
                                            "medium": {
                                                "name": "medium_teaching.png",
                                                "hash": "medium_teaching_53757a63aa",
                                                "ext": ".png",
                                                "mime": "image/png",
                                                "path": null,
                                                "width": 750,
                                                "height": 500,
                                                "size": 470,
                                                "url": "/uploads/medium_teaching_53757a63aa.png"
                                            },
                                            "small": {
                                                "name": "small_teaching.png",
                                                "hash": "small_teaching_53757a63aa",
                                                "ext": ".png",
                                                "mime": "image/png",
                                                "path": null,
                                                "width": 500,
                                                "height": 333,
                                                "size": 191.71,
                                                "url": "/uploads/small_teaching_53757a63aa.png"
                                            }
                                        },
                                        "hash": "teaching_53757a63aa",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "size": 103.49,
                                        "url": "/uploads/teaching_53757a63aa.png",
                                        "previewUrl": null,
                                        "provider": "local",
                                        "provider_metadata": null,
                                        "createdAt": "2026-09-23T14:37:37.566Z",
                                        "updatedAt": "2026-09-23T14:37:37.566Z"
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    },
    "meta": {}
}
```

### Response headers

`global::http-cache` marks anonymous content reads as publicly cacheable.

```http
HTTP/1.1 200 OK
Content-Security-Policy: connect-src 'self' https:;img-src 'self' data: blob: https://dl.airtable.com;media-src 'self' data: blob:;default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline'
X-DNS-Prefetch-Control: off
Expect-CT: max-age=0
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: no-referrer
Vary: Accept-Encoding, Origin
Content-Type: application/json; charset=utf-8
X-Powered-By: Strapi <strapi.io>
Cache-Control: public, max-age=60, stale-while-revalidate=600
Content-Length: 8008
Date: Wed, 23 Sep 2026 14:49:47 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### An explicit `?populate=` is left alone

A caller asking for less gets less: the blocks come back without their media, which is
the cheaper query it asked for.

```console
$ curl -s 'http://localhost:8270/api/home-page?populate[sections]=true' | python3 -m json.tool
```

```json
{
    "data": {
        "id": 1,
        "attributes": {
            "createdAt": "2026-09-23T14:37:37.581Z",
            "updatedAt": "2026-09-23T14:37:37.581Z",
            "publishedAt": "2026-09-23T14:37:37.568Z",
            "sections": [
                {
                    "id": 1,
                    "__component": "common.header",
                    "Text": "Surgical video, peer reviewed.",
                    "ButtonText": "Browse the library",
                    "ButtonLink": "/library"
                },
                {
                    "id": 1,
                    "__component": "common.two-column-block",
                    "TitleText": "Filmed in theatre, narrated by the operating surgeon",
                    "Description": "Every article on JOMI is a full-length operation recorded from the surgeon\u2019s point of view, with the surgeon narrating the decisions as they are made \u2014 why this plane, why this instrument, what to do when the anatomy is not what the textbook promised.",
                    "ButtonText": "Watch a sample operation",
                    "ButtonUrl": "/library/laparoscopic-cholecystectomy",
                    "ImagePosition": "Right"
                },
                {
                    "id": 2,
                    "__component": "common.two-column-block",
                    "TitleText": "Reviewed by surgeons before it is published",
                    "Description": "Each submission is reviewed by practising surgeons in the same speciality. Reviewers annotate the video itself rather than a manuscript about it, so the critique lands on the step it refers to and readers can see exactly what was questioned.",
                    "ButtonText": "How peer review works",
                    "ButtonUrl": "/about/peer-review",
                    "ImagePosition": "Left"
                },
                {
                    "id": 1,
                    "__component": "common.carousel"
                }
            ]
        }
    },
    "meta": {}
}
```

---

## `POST /graphql`

The front-end's committed operation, `graphql/cms/homepage.graphql` in
`jomi-challenge-frontend`, sent verbatim:

```graphql
query HomePage {
  homePage {
    data {
      attributes {
        sections {
          ... on ComponentCommonHeader {
            id
            Text
            ButtonText
            ButtonLink
          }
          ... on ComponentCommonCarousel {
            id
            Item {
              ... on ComponentCommonTwoColumnBlock {
                id
                TitleText
                Description
                ButtonText
                ButtonUrl
                ImagePosition
                Image {
                  data {
                    id
                    attributes {
                      url
                      previewUrl
                      alternativeText
                      width
                      height
                    }
                  }
                }
              }
            }
          }
          ... on ComponentCommonTwoColumnBlock {
            id
            TitleText
            Description
            ButtonText
            ButtonUrl
            ImagePosition
            Image {
              data {
                id
                attributes {
                  url
                  previewUrl
                  alternativeText
                  width
                  height
                }
              }
            }
          }
          ... on Error {
            code
            message
          }
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "homePage": {
      "data": {
        "attributes": {
          "sections": [
            {
              "id": "1",
              "Text": "Surgical video, peer reviewed.",
              "ButtonText": "Browse the library",
              "ButtonLink": "/library"
            },
            {
              "id": "1",
              "TitleText": "Filmed in theatre, narrated by the operating surgeon",
              "Description": "Every article on JOMI is a full-length operation recorded from the surgeon’s point of view, with the surgeon narrating the decisions as they are made — why this plane, why this instrument, what to do when the anatomy is not what the textbook promised.",
              "ButtonText": "Watch a sample operation",
              "ButtonUrl": "/library/laparoscopic-cholecystectomy",
              "ImagePosition": "Right",
              "Image": {
                "data": {
                  "id": "1",
                  "attributes": {
                    "url": "/uploads/operating_room_aaf3f8a8c7.png",
                    "previewUrl": null,
                    "alternativeText": "Surgeons operating under theatre lights",
                    "width": 900,
                    "height": 600
                  }
                }
              }
            },
            {
              "id": "2",
              "TitleText": "Reviewed by surgeons before it is published",
              "Description": "Each submission is reviewed by practising surgeons in the same speciality. Reviewers annotate the video itself rather than a manuscript about it, so the critique lands on the step it refers to and readers can see exactly what was questioned.",
              "ButtonText": "How peer review works",
              "ButtonUrl": "/about/peer-review",
              "ImagePosition": "Left",
              "Image": {
                "data": {
                  "id": "2",
                  "attributes": {
                    "url": "/uploads/peer_review_438150eeca.png",
                    "previewUrl": null,
                    "alternativeText": "A reviewer annotating a surgical video timeline",
                    "width": 900,
                    "height": 600
                  }
                }
              }
            },
            {
              "id": "1",
              "Item": [
                {
                  "id": "3",
                  "TitleText": "Laparoscopic cholecystectomy",
                  "Description": "Critical view of safety demonstrated in full, including the dissection that establishes it and the point at which the surgeon would convert.",
                  "ButtonText": "Open the article",
                  "ButtonUrl": "/library/laparoscopic-cholecystectomy",
                  "ImagePosition": "Left",
                  "Image": {
                    "data": {
                      "id": "3",
                      "attributes": {
                        "url": "/uploads/laparoscopy_a06c9167e3.png",
                        "previewUrl": null,
                        "alternativeText": "Laparoscopic instruments inside the abdominal cavity",
                        "width": 900,
                        "height": 600
                      }
                    }
                  }
                },
                {
                  "id": "4",
                  "TitleText": "Knee arthroscopy with meniscal repair",
                  "Description": "Portal placement, diagnostic sweep and an inside-out repair, with the surgeon explaining when a tear is worth repairing rather than trimming.",
                  "ButtonText": "Open the article",
                  "ButtonUrl": "/library/knee-arthroscopy",
                  "ImagePosition": "Right",
                  "Image": {
                    "data": {
                      "id": "4",
                      "attributes": {
                        "url": "/uploads/orthopedics_cbe5aec8f4.png",
                        "previewUrl": null,
                        "alternativeText": "An orthopaedic surgeon preparing a knee arthroscopy",
                        "width": 900,
                        "height": 600
                      }
                    }
                  }
                },
                {
                  "id": "5",
                  "TitleText": "Teaching files for residents",
                  "Description": "Programmes use JOMI to prepare residents for cases they are about to scrub on: watch the operation, read the review, then step into theatre.",
                  "ButtonText": "For institutions",
                  "ButtonUrl": "/institutions",
                  "ImagePosition": "Left",
                  "Image": {
                    "data": {
                      "id": "5",
                      "attributes": {
                        "url": "/uploads/teaching_53757a63aa.png",
                        "previewUrl": null,
                        "alternativeText": "Residents reviewing an operation on a wall display",
                        "width": 900,
                        "height": 600
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }
}
```

Note the absence of `__typename` in the payload: the document does not select it, and
Strapi only returns what is asked for. The front-end still branches on it because its
Apollo `InMemoryCache` adds `__typename` to every selection set by default.
`scripts/smoke.sh` therefore asks for it explicitly, which is what the `__typenames` line
in its output shows.

---

## `GET /api/content-pages`

```json
{
    "data": [
        {
            "id": 1,
            "attributes": {
                "slug": "about",
                "title": "About JOMI",
                "content": "## About\n\nJOMI is a peer-reviewed journal of surgical video. Articles are full-length operations, filmed in theatre and narrated by the operating surgeon.\n",
                "createdAt": "2026-09-23T14:37:37.587Z",
                "updatedAt": "2026-09-23T14:37:37.587Z",
                "publishedAt": "2026-09-23T14:37:37.587Z"
            }
        },
        {
            "id": 2,
            "attributes": {
                "slug": "peer-review",
                "title": "How peer review works",
                "content": "## Peer review\n\nReviewers annotate the video timeline directly. A submission is published once two reviewers in the same speciality sign off.\n",
                "createdAt": "2026-09-23T14:37:37.589Z",
                "updatedAt": "2026-09-23T14:37:37.589Z",
                "publishedAt": "2026-09-23T14:37:37.588Z"
            }
        },
        {
            "id": 3,
            "attributes": {
                "slug": "institutions",
                "title": "For institutions",
                "content": "## For institutions\n\nInstitutional subscriptions cover every resident and attending on a single sign-on, with usage reporting by department.\n",
                "createdAt": "2026-09-23T14:37:37.590Z",
                "updatedAt": "2026-09-23T14:37:37.590Z",
                "publishedAt": "2026-09-23T14:37:37.590Z"
            }
        }
    ],
    "meta": {
        "pagination": {
            "page": 1,
            "pageSize": 25,
            "pageCount": 1,
            "total": 3
        }
    }
}
```

---

## Query depth limit

`config/plugins.js` caps GraphQL selection-set depth at 12. The front-end's deepest real
query is 9; this one nests past the limit.

```console
$ curl -s -X POST http://localhost:8270/graphql -H 'Content-Type: application/json' \
    --data '{"query":"{ homePage { data { attributes { sections { ... on ComponentCommonCarousel { Item { Image { data { attributes { related { ... on ComponentCommonTwoColumnBlock { Image { data { attributes { related { __typename } } } } } } } } } } } } } } } }"}'
```

```json
{
  "errors": [
    {
      "message": "'' exceeds maximum operation depth of 12",
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED"
      }
    }
  ]
}
```
