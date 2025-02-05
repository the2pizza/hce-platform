import { test } from '@playwright/test'
import { generateId, PlatformSetting, PlatformURI } from '../utils'
import { NavigationMenuPage } from '../model/recruiting/navigation-menu-page'
import { allure } from 'allure-playwright'
import { CompaniesPage } from '../model/recruiting/companies-page'
import { NewCompany } from '../model/recruiting/types'
import { CompanyDetailsPage } from '../model/recruiting/company-details-page'

test.use({
  storageState: PlatformSetting
})

test.describe('Companies tests', () => {
  test.beforeEach(async ({ page }) => {
    await allure.parentSuite('Recruiting tests')
    await (await page.goto(`${PlatformURI}/workbench/sanity-ws/recruit`))?.finished()
  })

  test('Create a new Company', async ({ page }) => {
    const newCompany: NewCompany = {
      name: `Create a new Company test-${generateId()}`,
      socials: [
        {
          type: 'Phone',
          value: '3213221321213'
        },
        {
          type: 'Email',
          value: 'test+321313123@gmail.com'
        }
      ]
    }

    const navigationMenuPage = new NavigationMenuPage(page)
    await navigationMenuPage.buttonCompanies.click()

    const companiesPage = new CompaniesPage(page)
    await companiesPage.createNewCompany(newCompany)
    await companiesPage.openCompanyByName(newCompany.name)

    const companyDetailsPage = new CompanyDetailsPage(page)
    await companyDetailsPage.checkCompany(newCompany)
  })
})
