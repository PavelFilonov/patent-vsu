import {OperationScope} from '@tesler-ui/core/interfaces/operation'

export default {
    actions: [
        {
            type: 'create',
            text: 'Add New Standard',
            icon: 'plus-circle',
            showOnlyIcon: false,
            scope: 'bc' as OperationScope,
            autoSaveBefore: false
        },
        {
            type: 'save',
            text: 'Save',
            icon: 'save',
            showOnlyIcon: true,
            scope: ('record' as OperationScope) as OperationScope,
            autoSaveBefore: true
        },
        {
            type: 'delete',
            text: 'Delete',
            icon: 'delete',
            showOnlyIcon: true,
            scope: 'record' as OperationScope,
            autoSaveBefore: false
        },
        {
            type: 'back_to_list',
            text: 'To Standard List',
            showOnlyIcon: false,
            scope: 'record' as OperationScope,
            autoSaveBefore: true
        },
        {
            type: 'stn_view_edit',
            text: 'Edit',
            showOnlyIcon: false,
            scope: 'record' as OperationScope,
            autoSaveBefore: false
        },
        {
            type: 'wf_stn_publish_standard_translations',
            text: 'Publish',
            showOnlyIcon: false,
            scope: 'record' as OperationScope,
            autoSaveBefore: false
        },
        {
            type: 'stn_send_for_approval',
            text: 'Send for approval',
            showOnlyIcon: false,
            scope: 'record' as OperationScope,
            autoSaveBefore: false
        }
    ],
    fields: [
        {
            key: 'businessSector',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: true,
            filterable: true,
            // dictionaryName: 'BUSINESS_SECTOR',
            currentValue: 'Brand Presence',
            values: [
                {
                    value: 'Brand Presence',
                    icon: 'a'
                },
                {
                    value: 'Management & Organization',
                    icon: 'a'
                },
                {
                    value: 'Personnel & Training',
                    icon: 'a'
                },
                {
                    value: 'Marketing',
                    icon: 'a'
                },
                {
                    value: 'New Vehicle Sales',
                    icon: 'a'
                },
                {
                    value: 'Used Vehicle Sales',
                    icon: 'a'
                },
                {
                    value: 'Parts & Accessories',
                    icon: 'a'
                },
                {
                    value: 'Service',
                    icon: 'a'
                }
            ],
            filterValues: [
                {
                    value: 'Brand Presence'
                },
                {
                    value: 'Management & Organization'
                },
                {
                    value: 'Personnel & Training'
                },
                {
                    value: 'Marketing'
                },
                {
                    value: 'New Vehicle Sales'
                },
                {
                    value: 'Used Vehicle Sales'
                },
                {
                    value: 'Parts & Accessories'
                },
                {
                    value: 'Service'
                }
            ]
        },
        {
            key: 'sendingEntitiesList',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            currentValue: [
                {
                    id: '1014471',
                    value: 'GC0000842 : SIA Domenikss',
                    options: {}
                },
                {
                    id: '1014472',
                    value: 'GC0000819 : AS SILBERAUTO',
                    options: {}
                }
            ],
            values: [],
            filterValues: []
        },
        {
            key: 'regionList',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            currentValue: [
                {
                    id: '1014470',
                    value: 'BER',
                    options: {}
                }
            ],
            values: [],
            filterValues: [
                {
                    value: 'BER'
                },
                {
                    value: 'NAFTA'
                }
            ]
        },
        {
            key: 'auditCheckpoint',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            // dictionaryName: 'AUDIT_CHECKPOINT',
            currentValue: null,
            values: [
                {
                    value: 'Back Office',
                    icon: 'a'
                },
                {
                    value: 'Customer Contact Area',
                    icon: 'a'
                },
                {
                    value: 'Workshop',
                    icon: 'a'
                },
                {
                    value: 'MPC',
                    icon: 'a'
                },
                {
                    value: 'Delivery Outlet',
                    icon: 'a'
                },
                {
                    value: 'Site',
                    icon: 'a'
                },
                {
                    value: 'Exterior',
                    icon: 'a'
                },
                {
                    value: 'Show Room',
                    icon: 'a'
                },
                {
                    value: 'Warehouse and Parts Area',
                    icon: 'a'
                },
                {
                    value: 'Wholesaler (MPC,GD,PBS)',
                    icon: 'a'
                },
                {
                    value: 'TBD',
                    icon: 'a'
                },
                {
                    value: 'EvoBus',
                    icon: 'a'
                },
                {
                    value: 'Administration',
                    icon: 'a'
                }
            ],
            filterValues: [
                {
                    value: 'Back Office'
                },
                {
                    value: 'Customer Contact Area'
                },
                {
                    value: 'Workshop'
                },
                {
                    value: 'MPC'
                },
                {
                    value: 'Delivery Outlet'
                },
                {
                    value: 'Site'
                },
                {
                    value: 'Exterior'
                },
                {
                    value: 'Show Room'
                },
                {
                    value: 'Warehouse and Parts Area'
                },
                {
                    value: 'Wholesaler (MPC,GD,PBS)'
                },
                {
                    value: 'TBD'
                },
                {
                    value: 'EvoBus'
                },
                {
                    value: 'Administration'
                }
            ]
        },
        {
            key: 'auditLocation',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            // dictionaryName: 'AUDIT_LOCATION',
            currentValue: 'Off-site',
            values: [
                {
                    value: 'On-site',
                    icon: 'a'
                },
                {
                    value: 'Off-site',
                    icon: 'a'
                }
            ],
            filterValues: [
                {
                    value: 'On-site'
                },
                {
                    value: 'Off-site'
                }
            ]
        },
        {
            key: 'vstamp',
            disabled: true,
            forceActive: false,
            ephemeral: true,
            hidden: false,
            required: false,
            filterable: false,
            currentValue: 3,
            values: [],
            filterValues: []
        },
        {
            key: 'services',
            disabled: true,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            currentValue: [
                {
                    id: '1014468',
                    value: 'PC : Maybach : Service\n',
                    options: {
                        hint: '1014468'
                    }
                }
            ],
            values: [],
            filterValues: []
        },
        {
            key: 'auditType',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            // dictionaryName: 'AUDIT_TYPE',
            currentValue: 'Basic Bonus',
            values: [
                {
                    value: 'Must',
                    icon: 'a'
                },
                {
                    value: 'Basic Bonus',
                    icon: 'a'
                },
                {
                    value: 'Awarded Bonus',
                    icon: 'a'
                },
                {
                    value: 'Recommended',
                    icon: 'a'
                }
            ],
            filterValues: [
                {
                    value: 'Must'
                },
                {
                    value: 'Basic Bonus'
                },
                {
                    value: 'Awarded Bonus'
                },
                {
                    value: 'Recommended'
                }
            ]
        },
        {
            key: 'countryList',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            currentValue: [
                {
                    id: '1014469',
                    value: 'Algeria',
                    options: {}
                }
            ],
            values: [],
            filterValues: [
                {
                    value: 'Afghanistan'
                },
                {
                    value: 'Albania'
                },
                {
                    value: 'Algeria'
                },
                {
                    value: 'Andorra'
                },
                {
                    value: 'Angola'
                },
                {
                    value: 'Anguilla'
                },
                {
                    value: 'Antigua and Barbuda'
                },
                {
                    value: 'Argentina'
                },
                {
                    value: 'Armenia'
                },
                {
                    value: 'Aruba'
                },
                {
                    value: 'Australia'
                },
                {
                    value: 'Austria'
                },
                {
                    value: 'Azerbaijan'
                },
                {
                    value: 'Bahamas'
                },
                {
                    value: 'Bahrain'
                },
                {
                    value: 'Bangladesh'
                },
                {
                    value: 'Barbados'
                },
                {
                    value: 'Belarus'
                },
                {
                    value: 'Belgium'
                },
                {
                    value: 'Belize'
                },
                {
                    value: 'Benin'
                },
                {
                    value: 'Bermuda'
                },
                {
                    value: 'Bhutan'
                },
                {
                    value: 'Bolivia,Plurinational State Of'
                },
                {
                    value: 'Bosnia and Herzegovina'
                },
                {
                    value: 'Botswana'
                },
                {
                    value: 'Brazil'
                },
                {
                    value: 'Brunei Darussalam'
                },
                {
                    value: 'Bulgaria'
                },
                {
                    value: 'Burkina Faso'
                },
                {
                    value: 'Burundi'
                },
                {
                    value: 'Cambodia'
                },
                {
                    value: 'Cameroon'
                },
                {
                    value: 'Canada'
                },
                {
                    value: 'Cape Verde'
                },
                {
                    value: 'Cayman Islands'
                },
                {
                    value: 'Central African Republic'
                },
                {
                    value: 'Chad'
                },
                {
                    value: 'Chile'
                },
                {
                    value: 'China'
                },
                {
                    value: 'Colombia'
                },
                {
                    value: 'Congo'
                },
                {
                    value: 'Congo,The Democratic Republic of the'
                },
                {
                    value: 'Costa Rica'
                },
                {
                    value: 'Croatia'
                },
                {
                    value: 'Cuba'
                },
                {
                    value: 'Cura?ao'
                },
                {
                    value: 'Cyprus'
                },
                {
                    value: 'Czech Republic'
                },
                {
                    value: 'Denmark'
                },
                {
                    value: 'Djibouti'
                },
                {
                    value: 'Dominica'
                },
                {
                    value: 'Dominican Republic'
                },
                {
                    value: 'Ecuador'
                },
                {
                    value: 'Egypt'
                },
                {
                    value: 'El Salvador'
                },
                {
                    value: 'Equatorial Guinea'
                },
                {
                    value: 'Eritrea'
                },
                {
                    value: 'Estonia'
                },
                {
                    value: 'Ethiopia'
                },
                {
                    value: 'Faroe Islands'
                },
                {
                    value: 'Fiji'
                },
                {
                    value: 'Finland'
                },
                {
                    value: 'France'
                },
                {
                    value: 'French Guiana'
                },
                {
                    value: 'French Polynesia'
                },
                {
                    value: 'Gabon'
                },
                {
                    value: 'Gambia'
                },
                {
                    value: 'Georgia'
                },
                {
                    value: 'Germany'
                },
                {
                    value: 'Ghana'
                },
                {
                    value: 'Gibraltar'
                },
                {
                    value: 'Greece'
                },
                {
                    value: 'Greenland'
                },
                {
                    value: 'Grenada'
                },
                {
                    value: 'Guadeloupe'
                },
                {
                    value: 'Guam'
                },
                {
                    value: 'Guatemala'
                },
                {
                    value: 'Guinea'
                },
                {
                    value: 'Guinea-Bissau'
                },
                {
                    value: 'Guyana'
                },
                {
                    value: 'Haiti'
                },
                {
                    value: 'Honduras'
                },
                {
                    value: 'Hong Kong'
                },
                {
                    value: 'Hungary'
                },
                {
                    value: 'Iceland'
                },
                {
                    value: 'India'
                },
                {
                    value: 'Indonesia'
                },
                {
                    value: 'Iran,Islamic Republic of'
                },
                {
                    value: 'Iraq'
                },
                {
                    value: 'Ireland'
                },
                {
                    value: 'Israel'
                },
                {
                    value: 'Italy'
                },
                {
                    value: 'Ivory Coast'
                },
                {
                    value: 'Jamaica'
                },
                {
                    value: 'Japan'
                },
                {
                    value: 'Jordan'
                },
                {
                    value: 'Kazakhstan'
                },
                {
                    value: 'Kenya'
                },
                {
                    value: 'Kiribati'
                },
                {
                    value: 'Korea,Republic of'
                },
                {
                    value: 'Kuwait'
                },
                {
                    value: 'Kyrgyzstan'
                },
                {
                    value: "Laos People's Democratic Republic"
                },
                {
                    value: 'Latvia'
                },
                {
                    value: 'Lebanon'
                },
                {
                    value: 'Lesotho'
                },
                {
                    value: 'Liberia'
                },
                {
                    value: 'Libya'
                },
                {
                    value: 'Lithuania'
                },
                {
                    value: 'Luxembourg'
                },
                {
                    value: 'Macau'
                },
                {
                    value: 'Madagascar'
                },
                {
                    value: 'Malawi'
                },
                {
                    value: 'Malaysia'
                },
                {
                    value: 'Maldives'
                },
                {
                    value: 'Mali'
                },
                {
                    value: 'Malta'
                },
                {
                    value: 'Martinique'
                },
                {
                    value: 'Mauritania'
                },
                {
                    value: 'Mauritius'
                },
                {
                    value: 'Mexico'
                },
                {
                    value: 'Moldova,Republic of'
                },
                {
                    value: 'Mongolia'
                },
                {
                    value: 'Montenegro'
                },
                {
                    value: 'Montserrat'
                },
                {
                    value: 'Morocco'
                },
                {
                    value: 'Mozambique'
                },
                {
                    value: 'Myanmar'
                },
                {
                    value: 'Namibia'
                },
                {
                    value: 'Nepal'
                },
                {
                    value: 'Netherlands'
                },
                {
                    value: 'New Caledonia'
                },
                {
                    value: 'New Zealand'
                },
                {
                    value: 'Nicaragua'
                },
                {
                    value: 'Niger'
                },
                {
                    value: 'Nigeria'
                },
                {
                    value: 'North Macedonia'
                },
                {
                    value: 'Norway'
                },
                {
                    value: 'Oman'
                },
                {
                    value: 'Pakistan'
                },
                {
                    value: 'Palestinian Territory,Occupied'
                },
                {
                    value: 'Panama'
                },
                {
                    value: 'Papua New Guinea'
                },
                {
                    value: 'Paraguay'
                },
                {
                    value: 'Peru'
                },
                {
                    value: 'Philippines'
                },
                {
                    value: 'Poland'
                },
                {
                    value: 'Portugal'
                },
                {
                    value: 'Puerto Rico'
                },
                {
                    value: 'Qatar'
                },
                {
                    value: 'Reunion'
                },
                {
                    value: 'Romania'
                },
                {
                    value: 'Russian Federation'
                },
                {
                    value: 'Rwanda'
                },
                {
                    value: 'Saint Barthel?my'
                },
                {
                    value: 'Saint Kitts And Nevis'
                },
                {
                    value: 'Saint Lucia'
                },
                {
                    value: 'Saint Martin (French Part)'
                },
                {
                    value: 'Saint Vincent and the Grenadines'
                },
                {
                    value: 'Samoa'
                },
                {
                    value: 'Saudi Arabia'
                },
                {
                    value: 'Senegal'
                },
                {
                    value: 'Serbia'
                },
                {
                    value: 'Seychelles'
                },
                {
                    value: 'Sierra Leone'
                },
                {
                    value: 'Singapore'
                },
                {
                    value: 'Sint Maarten (Dutch Part)'
                },
                {
                    value: 'Slovakia (Slovak Republic)'
                },
                {
                    value: 'Slovenia'
                },
                {
                    value: 'Somalia'
                },
                {
                    value: 'South Africa'
                },
                {
                    value: 'South Sudan'
                },
                {
                    value: 'Spain'
                },
                {
                    value: 'Sri Lanka'
                },
                {
                    value: 'Sudan'
                },
                {
                    value: 'Suriname'
                },
                {
                    value: 'Swaziland'
                },
                {
                    value: 'Sweden'
                },
                {
                    value: 'Switzerland'
                },
                {
                    value: 'Syrian Arab Republic'
                },
                {
                    value: 'Taiwan,Province of China'
                },
                {
                    value: 'Tajikistan'
                },
                {
                    value: 'Tanzani,United Republic Of'
                },
                {
                    value: 'Thailand'
                },
                {
                    value: 'Togo'
                },
                {
                    value: 'Trinidad and Tobago'
                },
                {
                    value: 'Tunisia'
                },
                {
                    value: 'Turkey'
                },
                {
                    value: 'Turkmenistan'
                },
                {
                    value: 'Turks And Caicos Islands'
                },
                {
                    value: 'Uganda'
                },
                {
                    value: 'Ukraine'
                },
                {
                    value: 'United Arab Emirates'
                },
                {
                    value: 'United Kingdom'
                },
                {
                    value: 'Uruguay'
                },
                {
                    value: 'USA'
                },
                {
                    value: 'Uzbekistan'
                },
                {
                    value: 'Vanuatu'
                },
                {
                    value: 'Venezuela,Bolivarian Republic Of'
                },
                {
                    value: 'Vietnam'
                },
                {
                    value: 'Virgin Islands,British'
                },
                {
                    value: 'Yemen'
                },
                {
                    value: 'Zambia'
                },
                {
                    value: 'Zimbabwe'
                }
            ]
        },
        {
            key: 'statusCd',
            disabled: true,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            currentValue: 'Draft',
            values: [],
            filterValues: [
                {
                    value: 'Draft'
                },
                {
                    value: 'Waiting for approval'
                },
                {
                    value: 'Approved'
                },
                {
                    value: 'Published'
                }
            ]
        },
        {
            key: 'effectiveTo',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            currentValue: null,
            values: [],
            filterValues: []
        },
        {
            key: 'number',
            disabled: true,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            drillDown: '/screen/standard/view/standardview/standard/1014459',
            drillDownType: 'inner',
            currentValue: 'S.A.2.001',
            values: [],
            filterValues: []
        },
        {
            key: 'service',
            disabled: true,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: false,
            currentValue: 'PC : Maybach : Service\n',
            values: [],
            filterValues: []
        },
        {
            key: 'statusBgColor',
            disabled: true,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: false,
            currentValue: '#9E9E9E',
            values: [],
            filterValues: []
        },
        {
            key: 'uiStep',
            disabled: true,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: false,
            // dictionaryName: 'TASK_STATUS',
            currentValue: 'Draft',
            values: [
                {
                    value: 'Standard Description',
                    icon: 'a'
                },
                {
                    value: 'General Information',
                    icon: 'a'
                },
                {
                    value: 'Region and Service',
                    icon: 'a'
                },
                {
                    value: 'Translations',
                    icon: 'a'
                }
            ],
            filterValues: []
        },
        {
            key: 'name',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: true,
            filterable: true,
            currentValue: '3',
            values: [],
            filterValues: []
        },
        {
            key: 'id',
            disabled: true,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: false,
            currentValue: '1014459',
            values: [],
            filterValues: []
        },
        {
            key: 'text',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: true,
            filterable: true,
            currentValue: '33',
            values: [],
            filterValues: []
        },
        {
            key: 'category',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: true,
            filterable: true,
            // dictionaryName: 'CATEGORY',
            currentValue: 'Corporate Identity',
            values: [
                {
                    value: 'Site & Buildings',
                    icon: 'a'
                },
                {
                    value: 'Corporate Identity',
                    icon: 'a'
                },
                {
                    value: 'Opening Hours',
                    icon: 'a'
                },
                {
                    value: 'Quality Management',
                    icon: 'a'
                },
                {
                    value: 'Management Structure & Organization',
                    icon: 'a'
                },
                {
                    value: 'Business Managment & Controlling',
                    icon: 'a'
                },
                {
                    value: 'Financial Position & Assets',
                    icon: 'a'
                },
                {
                    value: 'IT-Facilities & Operations',
                    icon: 'a'
                },
                {
                    value: 'Environmental Protection',
                    icon: 'a'
                },
                {
                    value: 'Monitoring of Training Performances',
                    icon: 'a'
                },
                {
                    value: 'Human Resources Management',
                    icon: 'a'
                },
                {
                    value: 'Training & Qualifications',
                    icon: 'a'
                },
                {
                    value: 'Marketing Planning',
                    icon: 'a'
                },
                {
                    value: 'CRM (Customer Relationship Management)',
                    icon: 'a'
                },
                {
                    value: 'Customer Statisfaction',
                    icon: 'a'
                },
                {
                    value: 'Showroom & Exhibition Site',
                    icon: 'a'
                },
                {
                    value: 'Demonstration & Stock Vehicles',
                    icon: 'a'
                },
                {
                    value: 'Sales Process New Vehicles',
                    icon: 'a'
                },
                {
                    value: 'Order Processing',
                    icon: 'a'
                },
                {
                    value: 'Used Vehicles Presentation',
                    icon: 'a'
                },
                {
                    value: 'Sales Process Used Vehicles',
                    icon: 'a'
                },
                {
                    value: 'Stock Management',
                    icon: 'a'
                },
                {
                    value: 'Technical Assessment,Appraisal & Trade-in',
                    icon: 'a'
                },
                {
                    value: 'Parts Store',
                    icon: 'a'
                },
                {
                    value: 'Sales & Ordering Process',
                    icon: 'a'
                },
                {
                    value: 'Infrastructure',
                    icon: 'a'
                },
                {
                    value: 'Service Offered',
                    icon: 'a'
                },
                {
                    value: 'Warranty & Goodwill',
                    icon: 'a'
                },
                {
                    value: 'Service Reception',
                    icon: 'a'
                },
                {
                    value: 'Workshop Processes',
                    icon: 'a'
                },
                {
                    value: 'Vehicle Handover',
                    icon: 'a'
                }
            ],
            filterValues: [
                {
                    value: 'Site & Buildings'
                },
                {
                    value: 'Corporate Identity'
                },
                {
                    value: 'Opening Hours'
                },
                {
                    value: 'Quality Management'
                },
                {
                    value: 'Management Structure & Organization'
                },
                {
                    value: 'Business Managment & Controlling'
                },
                {
                    value: 'Financial Position & Assets'
                },
                {
                    value: 'IT-Facilities & Operations'
                },
                {
                    value: 'Environmental Protection'
                },
                {
                    value: 'Monitoring of Training Performances'
                },
                {
                    value: 'Human Resources Management'
                },
                {
                    value: 'Training & Qualifications'
                },
                {
                    value: 'Marketing Planning'
                },
                {
                    value: 'CRM (Customer Relationship Management)'
                },
                {
                    value: 'Customer Statisfaction'
                },
                {
                    value: 'Showroom & Exhibition Site'
                },
                {
                    value: 'Demonstration & Stock Vehicles'
                },
                {
                    value: 'Sales Process New Vehicles'
                },
                {
                    value: 'Order Processing'
                },
                {
                    value: 'Used Vehicles Presentation'
                },
                {
                    value: 'Sales Process Used Vehicles'
                },
                {
                    value: 'Stock Management'
                },
                {
                    value: 'Technical Assessment,Appraisal & Trade-in'
                },
                {
                    value: 'Parts Store'
                },
                {
                    value: 'Sales & Ordering Process'
                },
                {
                    value: 'Infrastructure'
                },
                {
                    value: 'Service Offered'
                },
                {
                    value: 'Warranty & Goodwill'
                },
                {
                    value: 'Service Reception'
                },
                {
                    value: 'Workshop Processes'
                },
                {
                    value: 'Vehicle Handover'
                }
            ]
        },
        {
            key: 'effectiveFrom',
            disabled: false,
            forceActive: false,
            ephemeral: false,
            hidden: false,
            required: false,
            filterable: true,
            currentValue: null,
            values: [],
            filterValues: []
        }
    ]
}
