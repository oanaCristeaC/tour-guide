const json2md = require('json2md');

console.log(
  json2md([
    {
      info: {
        _postman_id: 'd9b438de-efe0-4d32-b01f-beec89c4f44a',
        name: 'guide-tour',
        description:
          'This is the api description.\nhttps://learning.postman.com/docs/publishing-your-api/documenting-your-api/',
        schema:
          'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: [
        {
          name: 'Auth',
          item: [
            {
              name: 'SignUp',
              event: [
                {
                  listen: 'test',
                  script: {
                    id: '26049224-2c8e-4696-b61d-b4d52ad05be9',
                    exec: [
                      'pm.environment.set("JWT", pm.response.json().data.jwtToken);',
                    ],
                    type: 'text/javascript',
                  },
                },
              ],
              request: {
                method: 'POST',
                header: [],
                body: {
                  mode: 'raw',
                  raw:
                    '{\n    "name": "Jeroen Br",\n    "email": "jeroenbriels@mailsac.com",\n    "password": "Password_123",\n    "passwordConfirm": "Password_123"\n}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/users/signup',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', 'signup'],
                },
                description: 'Sign up',
              },
              response: [],
            },
            {
              name: 'Sign in',
              event: [
                {
                  listen: 'test',
                  script: {
                    id: 'd403e574-534e-45d6-b6dc-8e9bc360936c',
                    exec: [
                      'pm.environment.set("JWT", pm.response.json().data.jwtToken);',
                    ],
                    type: 'text/javascript',
                  },
                },
              ],
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'POST',
                header: [],
                body: {
                  mode: 'raw',
                  raw:
                    '{   "email": "jeroenbriels@mailsac.com",\n    "password": "{{password}}"\n}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/users/signin',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', 'signin'],
                },
                description: 'Sign in',
              },
              response: [],
            },
            {
              name: 'GetMe',
              event: [
                {
                  listen: 'test',
                  script: {
                    id: '4ad63be4-8f68-4cb0-a57e-68201063c2c3',
                    exec: [
                      'pm.environment.set("JWT", pm.response.json().data.jwtToken);',
                    ],
                    type: 'text/javascript',
                  },
                },
              ],
              protocolProfileBehavior: {
                disableBodyPruning: true,
              },
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'GET',
                header: [],
                body: {
                  mode: 'raw',
                  raw:
                    '{   "email": "miyah@example.com",\n    "password": "{{password}}"\n}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/users/me',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', 'me'],
                },
                description: 'Sign in',
              },
              response: [],
            },
            {
              name: 'Update Me',
              event: [
                {
                  listen: 'test',
                  script: {
                    id: '73aa79d1-ce71-417b-8a57-2dd9dc70307f',
                    exec: [
                      'pm.environment.set("JWT", pm.response.json().data.jwtToken);',
                    ],
                    type: 'text/javascript',
                  },
                },
              ],
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'PATCH',
                header: [],
                body: {
                  mode: 'raw',
                  raw: '{    "email": "test@yahoo.com"}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/users/update-me',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', 'update-me'],
                },
                description:
                  'Update current user details. Use different route for the password.',
              },
              response: [],
            },
            {
              name: 'Delete Me',
              event: [
                {
                  listen: 'test',
                  script: {
                    id: 'ae405f97-6bb7-4cf7-85bb-951c996bf83a',
                    exec: [
                      'pm.environment.set("JWT", pm.response.json().data.jwtToken);',
                    ],
                    type: 'text/javascript',
                  },
                },
              ],
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'DELETE',
                header: [],
                body: {
                  mode: 'raw',
                  raw: '',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/users/delete-me',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', 'delete-me'],
                },
                description: 'Delete current user.',
              },
              response: [],
            },
            {
              name: 'Forgot Pass',
              request: {
                method: 'POST',
                header: [],
                body: {
                  mode: 'raw',
                  raw: '{\n    "email": "ionelacristea@test.com"\n}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/users/forgot-password',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', 'forgot-password'],
                },
                description: 'Forgot password.',
              },
              response: [],
            },
            {
              name: 'Reset Pass',
              event: [
                {
                  listen: 'test',
                  script: {
                    id: '7f92ed72-1437-47d1-a0fe-9054644e1265',
                    exec: [
                      'pm.environment.set("JWT", pm.response.json().data.jwtToken);',
                    ],
                    type: 'text/javascript',
                  },
                },
              ],
              request: {
                method: 'PATCH',
                header: [],
                body: {
                  mode: 'raw',
                  raw:
                    '{\n    "password": "Password_123",\n    "passwordConfirm": "Password_123"\n}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw:
                    '{{URL}}/api/v1/users/reset-password/6dfacdafeadd45681d450f05ba6241b6e68f38fcc61f5e9f97633826d4cb02bf',
                  host: ['{{URL}}'],
                  path: [
                    'api',
                    'v1',
                    'users',
                    'reset-password',
                    '6dfacdafeadd45681d450f05ba6241b6e68f38fcc61f5e9f97633826d4cb02bf',
                  ],
                },
                description: 'Reset password.',
              },
              response: [],
            },
            {
              name: 'Update Pass',
              event: [
                {
                  listen: 'test',
                  script: {
                    id: '20252c32-41f3-4cd7-b0f2-68b2d7c16f27',
                    exec: [
                      'pm.environment.set("JWT", pm.response.json().data.jwtToken);',
                    ],
                    type: 'text/javascript',
                  },
                },
              ],
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'PATCH',
                header: [],
                body: {
                  mode: 'raw',
                  raw:
                    '{\n    "currentPassword": "{{password}}",\n    "password": "new-pass",\n    "passwordConfirm": "new-pass"\n}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/users/update-password',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', 'update-password'],
                },
              },
              response: [],
            },
          ],
          description:
            '***Authentication*** process uses auth token. Token is stored in <b>cookies</b>',
          event: [
            {
              listen: 'prerequest',
              script: {
                id: '1ece3d4a-8c42-4f35-8f24-34efcf647597',
                type: 'text/javascript',
                exec: [''],
              },
            },
            {
              listen: 'test',
              script: {
                id: '0998cc30-3ea5-4450-914b-77fd30f536bc',
                type: 'text/javascript',
                exec: [''],
              },
            },
          ],
          protocolProfileBehavior: {},
        },
        {
          name: 'Tours',
          item: [
            {
              name: 'Get tours',
              request: {
                method: 'GET',
                header: [
                  {
                    key: 'Authorization',
                    value: 'B',
                    type: 'text',
                    disabled: true,
                  },
                ],
                url: {
                  raw:
                    '{{URL}}/api/v1/tours?price[lt]=1000&ratingsAverage[gte]=4.5',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'tours'],
                  query: [
                    {
                      key: 'price[lt]',
                      value: '1000',
                      description:
                        'Supports query: equal to (eq), less than (lt), greater than (gt), greater than or egual to (gte), less than or equal to (lte)',
                    },
                    {
                      key: 'ratingsAverage[gte]',
                      value: '4.5',
                    },
                  ],
                },
                description: 'Get all tours.',
              },
              response: [],
            },
            {
              name: 'Get tour',
              protocolProfileBehavior: {
                disableBodyPruning: true,
              },
              request: {
                method: 'GET',
                header: [],
                body: {
                  mode: 'raw',
                  raw: '{"name": "test name", "price": 400}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/tours/5f9d8d6803d489549f2320d5',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'tours', '5f9d8d6803d489549f2320d5'],
                },
                description: 'Get a tour by id.',
              },
              response: [],
            },
            {
              name: 'Get mothly tours',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'GET',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/tours/monthly-plan/2021',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'tours', 'monthly-plan', '2021'],
                },
                description: 'Get monthly plan.',
              },
              response: [],
            },
            {
              name: 'Tours stats',
              request: {
                method: 'GET',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/tours/stats',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'tours', 'stats'],
                },
                description: 'Get tour statistics.',
              },
              response: [],
            },
            {
              name: 'Post a tour',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'POST',
                header: [],
                body: {
                  mode: 'raw',
                  raw:
                    ' {\n    "startLocation": {\n      "description": "TEST TOUR",\n      "type": "Point",\n      "coordinates": [-80.185942, 25.774772],\n      "address": "301 Biscayne Blvd, Miami, FL 33132, USA"\n    },\n    "images": ["tour-2-1.jpg", "tour-2-2.jpg", "tour-2-3.jpg"],\n    "startDates": [\n      "2021-06-19T09:00:00.000Z",\n      "2021-07-20T09:00:00.000Z",\n      "2021-08-18T09:00:00.000Z"\n    ],\n    "name": "The Sea Explorer2",\n    "duration": 7,\n    "maxGroupSize": 15,\n    "difficulty": "medium",\n    "guides": ["5f9c85d365b8d1209e66877a", "5f9c85d365b8d1209e66877b"],\n    "price": 497,\n    "summary": "Exploring the jaw-dropping US east coast by foot and by boat",\n    "imageCover": "tour-2-cover.jpg"\n }',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/tours',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'tours'],
                },
                description: 'Post a new tour.',
              },
              response: [],
            },
            {
              name: 'Delete tour',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'DELETE',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/tours/5fa84a41cf4d51791470ed53',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'tours', '5fa84a41cf4d51791470ed53'],
                },
                description: 'Delete a tour by id.',
              },
              response: [],
            },
            {
              name: 'Update tour',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'PATCH',
                header: [],
                body: {
                  mode: 'formdata',
                  formdata: [
                    {
                      key: 'imageCover',
                      type: 'file',
                      src: '/home/ionela/Pictures/photos/Sylvia/DSC_4643.JPG',
                    },
                    {
                      key: 'images',
                      type: 'file',
                      src: '/home/ionela/Pictures/photos/Sylvia/DSC_4578.JPG',
                      disabled: true,
                    },
                    {
                      key: 'images',
                      type: 'file',
                      src: '/home/ionela/Pictures/photos/Sylvia/DSC_4565.JPG',
                      disabled: true,
                    },
                  ],
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/tours/5f9d8d6803d489549f2320d5',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'tours', '5f9d8d6803d489549f2320d5'],
                },
                description: 'Update a tour.',
              },
              response: [],
            },
            {
              name: 'Get tours with radius',
              request: {
                method: 'GET',
                header: [],
                url: {
                  raw:
                    '{{URL}}/api/v1/tours/tours-within/1000/centre/34.071308, -118.236242/unit/km',
                  host: ['{{URL}}'],
                  path: [
                    'api',
                    'v1',
                    'tours',
                    'tours-within',
                    '1000',
                    'centre',
                    '34.071308, -118.236242',
                    'unit',
                    'km',
                  ],
                },
                description:
                  'Get tours from provided location within provided radius.',
              },
              response: [],
            },
            {
              name: 'Get tour distance',
              request: {
                method: 'GET',
                header: [],
                url: {
                  raw:
                    '{{URL}}/api/v1/tours/distances/34.071308, -118.236242/unit/mi',
                  host: ['{{URL}}'],
                  path: [
                    'api',
                    'v1',
                    'tours',
                    'distances',
                    '34.071308, -118.236242',
                    'unit',
                    'mi',
                  ],
                },
                description: 'Get tours by distance.',
              },
              response: [],
            },
          ],
          description:
            'Retrive and update tours. Get statistics and distances to all tours.',
          event: [
            {
              listen: 'prerequest',
              script: {
                id: '78fcab3c-038d-499b-8326-aef3425fd131',
                type: 'text/javascript',
                exec: [''],
              },
            },
            {
              listen: 'test',
              script: {
                id: '0ee8c02e-32b9-4e0e-87e8-9f304c2367a6',
                type: 'text/javascript',
                exec: [''],
              },
            },
          ],
          protocolProfileBehavior: {},
        },
        {
          name: 'Users',
          item: [
            {
              name: 'Get Me',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'GET',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/users/me',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', 'me'],
                },
                description: 'Get my details.',
              },
              response: [],
            },
            {
              name: 'Get users',
              request: {
                method: 'GET',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/users',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users'],
                },
                description: 'Get all users.',
              },
              response: [],
            },
            {
              name: 'Create user',
              request: {
                method: 'POST',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/users',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users'],
                },
                description: 'Create a new user.',
              },
              response: [],
            },
            {
              name: 'Get user',
              request: {
                method: 'GET',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/users/5f9c85d365b8d1209e66877a',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', '5f9c85d365b8d1209e66877a'],
                },
                description: 'Get a specific user.',
              },
              response: [],
            },
            {
              name: 'Delete user',
              request: {
                method: 'DELETE',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/users/1',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', '1'],
                },
                description: 'Delete a user.',
              },
              response: [],
            },
            {
              name: 'Update user',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'PATCH',
                header: [],
                body: {
                  mode: 'formdata',
                  formdata: [
                    {
                      key: 'name',
                      value: 'Laura J. Wilson',
                      type: 'text',
                    },
                    {
                      key: 'photo',
                      type: 'file',
                      src: '/home/ionela/Pictures/silk dress.jpeg',
                    },
                  ],
                },
                url: {
                  raw: '{{URL}}/api/v1/users/update-me',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'users', 'update-me'],
                },
                description: 'Update user details.',
              },
              response: [],
            },
          ],
          description: 'Used by the admin to get and update users details.',
          event: [
            {
              listen: 'prerequest',
              script: {
                id: '5dc68820-be3c-4c21-9cea-98b9b8b86cbd',
                type: 'text/javascript',
                exec: [''],
              },
            },
            {
              listen: 'test',
              script: {
                id: '84e4a628-960d-452d-9a04-c846b83b8f48',
                type: 'text/javascript',
                exec: [''],
              },
            },
          ],
          protocolProfileBehavior: {},
        },
        {
          name: 'Reviews',
          item: [
            {
              name: 'Get reviews',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'GET',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/reviews',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'reviews'],
                },
                description: 'Get all reviews.',
              },
              response: [],
            },
            {
              name: 'Get review',
              request: {
                method: 'GET',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/reviews/5fa857179572d1094d51277e',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'reviews', '5fa857179572d1094d51277e'],
                },
                description: 'Get review by id.',
              },
              response: [],
            },
            {
              name: 'Create review',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'POST',
                header: [],
                body: {
                  mode: 'raw',
                  raw:
                    '{\n    "review": "I am supper happy with it.- Sofi",\n    "rating": 4,\n    "tour": "5f9d8d6803d489549f2320d0"\n}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/reviews',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'reviews'],
                },
                description: 'Create a tour review.',
              },
              response: [],
            },
            {
              name: 'Delete review',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'DELETE',
                header: [],
                body: {
                  mode: 'raw',
                  raw: '',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/reviews/5fac4d7ed9837065737d3e49',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'reviews', '5fac4d7ed9837065737d3e49'],
                },
                description: 'Delete a review by id.',
              },
              response: [],
            },
            {
              name: 'Update review',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'PATCH',
                header: [],
                body: {
                  mode: 'raw',
                  raw: '{\n    "rating": 5,\n    "review": "Perfect trip"\n}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/reviews/5fb038f0b5dc496078419371',
                  host: ['{{URL}}'],
                  path: ['api', 'v1', 'reviews', '5fb038f0b5dc496078419371'],
                },
                description: 'Update a review.',
              },
              response: [],
            },
          ],
          description: 'Create and update reviews on a tour.',
          event: [
            {
              listen: 'prerequest',
              script: {
                id: '98443733-8d86-4bb8-b913-e8ea2acbda52',
                type: 'text/javascript',
                exec: [''],
              },
            },
            {
              listen: 'test',
              script: {
                id: '0ef988bd-cf30-4ac4-9aa3-94c688ec415e',
                type: 'text/javascript',
                exec: [''],
              },
            },
          ],
          protocolProfileBehavior: {},
        },
        {
          name: 'Tour/Reviews',
          item: [
            {
              name: 'Create Review',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'POST',
                header: [],
                body: {
                  mode: 'raw',
                  raw: '{\n    "rating": 5,\n    "review": "super tour"\n}',
                  options: {
                    raw: {
                      language: 'json',
                    },
                  },
                },
                url: {
                  raw: '{{URL}}/api/v1/tours/5fa84cfc91163d7e246ed065/reviews',
                  host: ['{{URL}}'],
                  path: [
                    'api',
                    'v1',
                    'tours',
                    '5fa84cfc91163d7e246ed065',
                    'reviews',
                  ],
                },
                description: 'Create a review on a tour.',
              },
              response: [],
            },
            {
              name: 'Get reviews',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'GET',
                header: [],
                url: {
                  raw: '{{URL}}/api/v1/tours/5f9d8d6803d489549f2320f1/reviews',
                  host: ['{{URL}}'],
                  path: [
                    'api',
                    'v1',
                    'tours',
                    '5f9d8d6803d489549f2320f1',
                    'reviews',
                  ],
                },
                description: 'Get all tour reviews.',
              },
              response: [],
            },
          ],
          description:
            'Different route to create and update reviews on a tour.',
          event: [
            {
              listen: 'prerequest',
              script: {
                id: '6c03eaa1-9449-4b72-908e-83415eedcf3d',
                type: 'text/javascript',
                exec: [''],
              },
            },
            {
              listen: 'test',
              script: {
                id: 'ee842d54-e670-4c38-bae9-9e059c8bb5d9',
                type: 'text/javascript',
                exec: [''],
              },
            },
          ],
          protocolProfileBehavior: {},
        },
        {
          name: 'Bookings',
          item: [
            {
              name: 'Get booking session',
              request: {
                auth: {
                  type: 'bearer',
                  bearer: [
                    {
                      key: 'token',
                      value: '{{JWT}}',
                      type: 'string',
                    },
                  ],
                },
                method: 'GET',
                header: [],
                url: {
                  raw:
                    '{{URL}}/api/v1/bookings/checkout-session/5f9d8d6803d489549f2320d5',
                  host: ['{{URL}}'],
                  path: [
                    'api',
                    'v1',
                    'bookings',
                    'checkout-session',
                    '5f9d8d6803d489549f2320d5',
                  ],
                },
              },
              response: [],
            },
          ],
          protocolProfileBehavior: {},
        },
      ],
      event: [
        {
          listen: 'prerequest',
          script: {
            id: 'd6233777-44ac-4b2e-9bc8-a9283ef78b7e',
            type: 'text/javascript',
            exec: [''],
          },
        },
        {
          listen: 'test',
          script: {
            id: '1c07062a-649a-4e1d-a522-f342c20959d0',
            type: 'text/javascript',
            exec: [''],
          },
        },
      ],
      protocolProfileBehavior: {},
    },
  ])
);
